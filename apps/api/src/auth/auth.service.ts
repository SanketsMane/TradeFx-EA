import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Role, User, UserStatus } from '@prisma/client';
import * as argon2 from 'argon2';
import { randomBytes } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit/audit.service';
import { MailService } from '../mail/mail.service';
import { TokenService } from './token.service';
import { normalizePhone } from '../common/phone';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SessionMeta {
  userAgent?: string;
  ip?: string;
}

export interface PublicUser {
  id: string;
  email: string;
  role: User['role'];
  status: UserStatus;
}

export interface LoginResult extends AuthTokens {
  user: PublicUser;
}

@Injectable()
export class AuthService {
  private readonly RESET_TTL_MIN = 30;

  constructor(
    private readonly prisma: PrismaService,
    private readonly tokens: TokenService,
    private readonly audit: AuditService,
    private readonly mail: MailService,
  ) {}

  /**
   * Self-service sign-up. Always creates a CUSTOMER — staff accounts are
   * provisioned through /admins, and nothing a caller sends can change the
   * role, so this route cannot be used to mint an admin.
   */
  async register(
    input: { fullName: string; email: string; password: string; phone?: string },
    meta: SessionMeta = {},
  ): Promise<LoginResult> {
    const email = input.email.toLowerCase().trim();

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      // The address is already discoverable through the sign-in form, so a
      // clear message here costs nothing and saves a support ticket.
      throw new ConflictException('An account with that email already exists.');
    }

    // A phone number is a sign-in identity, so it has to normalise cleanly and
    // be free. Rejecting here beats a unique-constraint 500 later.
    let phone: string | null = null;
    if (input.phone?.trim()) {
      phone = normalizePhone(input.phone);
      if (!phone) {
        throw new BadRequestException('Enter a valid 10-digit Indian mobile number.');
      }
      const phoneTaken = await this.prisma.user.findUnique({ where: { phone } });
      if (phoneTaken) {
        throw new ConflictException('An account with that mobile number already exists.');
      }
    }

    const passwordHash = await argon2.hash(input.password);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        role: Role.CUSTOMER,
        fullName: input.fullName.trim(),
        phone,
      },
    });

    const session = await this.prisma.session.create({
      data: { userId: user.id, hashedToken: '', userAgent: meta.userAgent, ip: meta.ip },
    });
    const tokens = await this.issueTokens(user, session.id);

    await this.audit.log({
      userId: user.id,
      action: 'AUTH_REGISTER',
      entityType: 'User',
      entityId: user.id,
      meta: { email },
    });

    return { ...tokens, user: AuthService.toPublicUser(user) };
  }

  async login(email: string, password: string, meta: SessionMeta = {}): Promise<LoginResult> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Uniform failure to avoid leaking which part was wrong.
    const invalid = new UnauthorizedException('Invalid credentials');
    if (!user || user.status === UserStatus.DISABLED) {
      await this.audit.log({
        userId: user?.id,
        action: 'AUTH_LOGIN_FAILED',
        entityType: 'User',
        meta: { email: email.toLowerCase(), reason: user ? 'disabled' : 'unknown_user' },
      });
      throw invalid;
    }

    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) {
      await this.audit.log({
        userId: user.id,
        action: 'AUTH_LOGIN_FAILED',
        entityType: 'User',
        entityId: user.id,
        meta: { email: email.toLowerCase(), reason: 'bad_password' },
      });
      throw invalid;
    }

    // Open a new session (one per device) and issue tokens bound to it.
    const session = await this.prisma.session.create({
      data: { userId: user.id, hashedToken: '', userAgent: meta.userAgent, ip: meta.ip },
    });
    const tokens = await this.issueTokens(user, session.id);

    await this.audit.log({
      userId: user.id,
      action: 'AUTH_LOGIN',
      entityType: 'User',
      entityId: user.id,
    });

    return { ...tokens, user: AuthService.toPublicUser(user) };
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const invalid = new UnauthorizedException('Invalid refresh token');

    let payload: { sub: string; sid: string };
    try {
      payload = await this.tokens.verifyRefresh(refreshToken);
    } catch {
      throw invalid;
    }

    const session = await this.prisma.session.findUnique({ where: { id: payload.sid } });
    if (!session || session.revokedAt || session.userId !== payload.sub || !session.hashedToken) {
      throw invalid;
    }

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || user.status === UserStatus.DISABLED) throw invalid;

    const matches = await argon2.verify(session.hashedToken, refreshToken);
    if (!matches) throw invalid;

    const tokens = await this.issueTokens(user, session.id);
    await this.prisma.session.update({
      where: { id: session.id },
      data: { lastUsedAt: new Date() },
    });
    return tokens;
  }

  async logout(userId: string, sid?: string): Promise<void> {
    // Revoke just this device's session (fall back to all if sid is unknown).
    if (sid) {
      await this.prisma.session.updateMany({
        where: { id: sid, userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    } else {
      await this.prisma.session.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    await this.audit.log({
      userId,
      action: 'AUTH_LOGOUT',
      entityType: 'User',
      entityId: userId,
    });
  }

  // ---- Session management ----
  async listSessions(userId: string, currentSid?: string) {
    const sessions = await this.prisma.session.findMany({
      where: { userId, revokedAt: null },
      orderBy: { lastUsedAt: 'desc' },
      select: { id: true, userAgent: true, ip: true, createdAt: true, lastUsedAt: true },
    });
    return sessions.map((s) => ({ ...s, current: s.id === currentSid }));
  }

  async revokeSession(userId: string, sessionId: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: { id: sessionId, userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    await this.audit.log({
      userId,
      action: 'AUTH_SESSION_REVOKED',
      entityType: 'Session',
      entityId: sessionId,
    });
  }

  /** Revoke every session except the caller's current one. */
  async revokeOtherSessions(userId: string, currentSid?: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: { userId, revokedAt: null, ...(currentSid ? { id: { not: currentSid } } : {}) },
      data: { revokedAt: new Date() },
    });
    await this.audit.log({
      userId,
      action: 'AUTH_SESSIONS_REVOKED_OTHERS',
      entityType: 'User',
      entityId: userId,
    });
  }

  /** Self-service password change. Verifies the current password, then rotates. */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();

    const ok = await argon2.verify(user.passwordHash, currentPassword);
    if (!ok) throw new BadRequestException('Current password is incorrect.');
    if (await argon2.verify(user.passwordHash, newPassword)) {
      throw new BadRequestException('New password must be different from the current one.');
    }

    const passwordHash = await argon2.hash(newPassword);
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash } });
    // Invalidate every session on password change (sign out all devices).
    await this.prisma.session.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    await this.audit.log({
      userId,
      action: 'AUTH_PASSWORD_CHANGED',
      entityType: 'User',
      entityId: userId,
    });
  }

  /**
   * Self-service reset request. Always resolves the same way (no account
   * enumeration): for a valid, active account it stores a hashed one-time token
   * and emails a reset link. Never throws to the caller.
   */
  async forgotPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || user.status === UserStatus.DISABLED) return;

    const token = randomBytes(32).toString('base64url');
    const resetTokenHash = await argon2.hash(token);
    const resetTokenExpiresAt = new Date(Date.now() + this.RESET_TTL_MIN * 60_000);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetTokenHash, resetTokenExpiresAt },
    });

    await this.audit.log({
      userId: user.id,
      action: 'AUTH_PASSWORD_RESET_REQUESTED',
      entityType: 'User',
      entityId: user.id,
    });

    // Best-effort — a mail failure must not reveal whether the account exists.
    await this.mail.sendPasswordResetLink(user.email, token, this.RESET_TTL_MIN).catch(() => undefined);
  }

  /** Complete a reset: verify the one-time token, set the new password, sign out everywhere. */
  async resetPassword(email: string, token: string, newPassword: string): Promise<void> {
    const invalid = new BadRequestException('This reset link is invalid or has expired.');
    const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (
      !user ||
      user.status === UserStatus.DISABLED ||
      !user.resetTokenHash ||
      !user.resetTokenExpiresAt ||
      user.resetTokenExpiresAt.getTime() < Date.now()
    ) {
      throw invalid;
    }

    const ok = await argon2.verify(user.resetTokenHash, token);
    if (!ok) throw invalid;

    const passwordHash = await argon2.hash(newPassword);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetTokenHash: null, resetTokenExpiresAt: null },
    });
    // Sign out every existing session after a reset.
    await this.prisma.session.updateMany({
      where: { userId: user.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    await this.audit.log({
      userId: user.id,
      action: 'AUTH_PASSWORD_RESET',
      entityType: 'User',
      entityId: user.id,
    });
  }

  async me(userId: string): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    return AuthService.toPublicUser(user);
  }

  /**
   * Opens a session for an already-authenticated user and returns tokens.
   * Shared by password login and OTP sign-in — whatever proved identity, the
   * session handling after it is identical.
   */
  async startSession(user: User, meta: SessionMeta = {}): Promise<LoginResult> {
    const session = await this.prisma.session.create({
      data: { userId: user.id, hashedToken: '', userAgent: meta.userAgent, ip: meta.ip },
    });
    const tokens = await this.issueTokens(user, session.id);
    return { ...tokens, user: AuthService.toPublicUser(user) };
  }

  /** Issues an access + refresh pair bound to a session, and rotates the stored hash. */
  private async issueTokens(user: User, sessionId: string): Promise<AuthTokens> {
    const accessToken = await this.tokens.signAccess({
      sub: user.id,
      email: user.email,
      role: user.role,
      sid: sessionId,
    });
    const refreshToken = await this.tokens.signRefresh({ sub: user.id, sid: sessionId });

    const hashedToken = await argon2.hash(refreshToken);
    await this.prisma.session.update({
      where: { id: sessionId },
      data: { hashedToken },
    });

    return { accessToken, refreshToken };
  }

  private static toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    };
  }
}
