import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Role, User, UserStatus } from '@prisma/client';
import * as argon2 from 'argon2';
import { randomBytes, randomInt } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit/audit.service';
import { SmsService } from '../sms/sms.service';
import { normalizePhone } from '../common/phone';
import { AuthService, LoginResult, SessionMeta } from './auth.service';

const CODE_LENGTH = 6;
const TTL_SECONDS = 300; // 5 minutes
const RESEND_COOLDOWN_SECONDS = 60;
const MAX_ATTEMPTS = 5;

export interface OtpRequestResult {
  sent: true;
  expiresInSeconds: number;
  resendAfterSeconds: number;
}

/** Verification succeeded but we need a name before creating the account. */
export interface OtpNeedsProfile {
  status: 'PROFILE_REQUIRED';
  phone: string;
}

export type OtpVerifyResult = (LoginResult & { status: 'SIGNED_IN' }) | OtpNeedsProfile;

/**
 * Mobile sign-in by one-time code.
 *
 * Deliberately does not distinguish "this number has an account" from "it
 * does not" — the request endpoint answers identically either way. Phone
 * numbers of forex customers are a valuable targeting list, and an endpoint
 * that confirms membership hands one over. The cost is that a mistyped number
 * fails at the code step rather than the number step, which the UI explains.
 */
@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly sms: SmsService,
    private readonly auth: AuthService,
  ) {}

  async request(rawPhone: string, meta: SessionMeta = {}): Promise<OtpRequestResult> {
    const phone = normalizePhone(rawPhone);
    if (!phone) {
      throw new BadRequestException('Enter a valid 10-digit Indian mobile number.');
    }

    // Cooldown: one code per minute per number, whatever the caller's IP.
    const recent = await this.prisma.otpChallenge.findFirst({
      where: { phone, createdAt: { gt: new Date(Date.now() - RESEND_COOLDOWN_SECONDS * 1000) } },
      orderBy: { createdAt: 'desc' },
    });
    if (recent) {
      const waitMs = recent.createdAt.getTime() + RESEND_COOLDOWN_SECONDS * 1000 - Date.now();
      throw new BadRequestException(
        `Please wait ${Math.ceil(waitMs / 1000)} seconds before asking for another code.`,
      );
    }

    // A new code invalidates any outstanding one, so an old SMS cannot be replayed.
    await this.prisma.otpChallenge.updateMany({
      where: { phone, consumedAt: null },
      data: { consumedAt: new Date() },
    });

    const code = OtpService.generateCode();
    await this.prisma.otpChallenge.create({
      data: {
        phone,
        codeHash: await argon2.hash(code),
        expiresAt: new Date(Date.now() + TTL_SECONDS * 1000),
        ip: meta.ip,
      },
    });

    // Send after persisting: a delivered code with no challenge behind it is
    // worse than a challenge nobody uses.
    await this.sms.sendOtp(phone, code);

    await this.audit.log({
      action: 'OTP_REQUESTED',
      entityType: 'OtpChallenge',
      meta: { phone: OtpService.mask(phone) },
    });

    return {
      sent: true,
      expiresInSeconds: TTL_SECONDS,
      resendAfterSeconds: RESEND_COOLDOWN_SECONDS,
    };
  }

  /**
   * Checks the code and signs the caller in, creating the account if the
   * number is new. A new number needs a name, which the sign-up form supplies;
   * when it is missing we say so rather than inventing one.
   */
  async verify(
    rawPhone: string,
    code: string,
    fullName: string | undefined,
    meta: SessionMeta = {},
  ): Promise<OtpVerifyResult> {
    const phone = normalizePhone(rawPhone);
    if (!phone) throw new BadRequestException('Enter a valid 10-digit Indian mobile number.');

    const invalid = new UnauthorizedException(
      'That code is not valid or has expired. Check the number and request a new one.',
    );

    const challenge = await this.prisma.otpChallenge.findFirst({
      where: { phone, consumedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    if (!challenge) throw invalid;

    if (challenge.attempts >= MAX_ATTEMPTS) {
      // Burn it so guessing cannot continue against the same challenge.
      await this.prisma.otpChallenge.update({
        where: { id: challenge.id },
        data: { consumedAt: new Date() },
      });
      throw new UnauthorizedException('Too many incorrect attempts. Please request a new code.');
    }

    const matches = await argon2.verify(challenge.codeHash, code.trim());
    if (!matches) {
      await this.prisma.otpChallenge.update({
        where: { id: challenge.id },
        data: { attempts: { increment: 1 } },
      });
      throw invalid;
    }

    const existing = await this.prisma.user.findUnique({ where: { phone } });

    if (!existing && !fullName?.trim()) {
      // Correct code, but there is nothing to create an account from yet. The
      // challenge stays live so the sign-up form can finish with a name.
      return { status: 'PROFILE_REQUIRED', phone };
    }

    await this.prisma.otpChallenge.update({
      where: { id: challenge.id },
      data: { consumedAt: new Date() },
    });

    let user: User;
    if (existing) {
      if (existing.status === UserStatus.DISABLED) {
        throw new UnauthorizedException('This account has been disabled. Please contact support.');
      }
      user = existing;
    } else {
      user = await this.prisma.user.create({
        data: {
          // Phone-only sign-ups have no email yet; a placeholder keeps the
          // unique column satisfied and is replaced when they add a real one.
          email: `${phone}@phone.tradefx.local`,
          // No password: this account signs in by OTP. The hash is a random
          // value no one holds, so the password path can never match.
          passwordHash: await argon2.hash(OtpService.unusablePassword()),
          role: Role.CUSTOMER,
          fullName: fullName!.trim(),
          phone,
        },
      });
    }

    await this.audit.log({
      userId: user.id,
      action: existing ? 'AUTH_LOGIN_OTP' : 'AUTH_REGISTER_OTP',
      entityType: 'User',
      entityId: user.id,
      meta: { phone: OtpService.mask(phone) },
    });

    const result = await this.auth.startSession(user, meta);
    return { ...result, status: 'SIGNED_IN' };
  }

  /** Zero-padded so every code is the same length. */
  private static generateCode(): string {
    return String(randomInt(0, 10 ** CODE_LENGTH)).padStart(CODE_LENGTH, '0');
  }

  /**
   * A password nobody holds, so an OTP-only account can never be signed into
   * through the password route. 32 random bytes, not a number — `randomInt`
   * caps at 2^48 and throws above it.
   */
  private static unusablePassword(): string {
    return `otp-only:${randomBytes(32).toString('hex')}`;
  }

  private static mask(phone: string): string {
    return `${'*'.repeat(Math.max(0, phone.length - 2))}${phone.slice(-2)}`;
  }
}
