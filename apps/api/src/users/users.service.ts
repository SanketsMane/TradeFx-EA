import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role, UserStatus } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit/audit.service';
import { MailService } from '../mail/mail.service';
import { Actor } from '../common/scope';
import { UserQueryDto } from './dto/user-query.dto';

const LIST_VIEW = {
  id: true,
  email: true,
  fullName: true,
  phone: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { licenses: true, ownedAccounts: true, quoteRequests: true } },
} satisfies Prisma.UserSelect;

export type UserListItem = Prisma.UserGetPayload<{ select: typeof LIST_VIEW }>;

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly mail: MailService,
  ) {}

  // -------------------------------------------------------------------------
  // Read
  // -------------------------------------------------------------------------
  async findAll(q: UserQueryDto): Promise<{ items: UserListItem[]; total: number }> {
    const term = q.q?.trim();
    const where: Prisma.UserWhereInput = {
      ...(q.role ? { role: q.role } : {}),
      ...(q.status ? { status: q.status } : {}),
      ...(term
        ? {
            OR: [
              { email: { contains: term, mode: 'insensitive' } },
              { fullName: { contains: term, mode: 'insensitive' } },
              { phone: { contains: term.replace(/\D/g, '') || term } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: Math.min(q.limit ?? 50, 200),
        skip: q.offset ?? 0,
        select: LIST_VIEW,
      }),
      this.prisma.user.count({ where }),
    ]);
    return { items, total };
  }

  /** Everything about one person, in the order an admin actually needs it. */
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        ...LIST_VIEW,
        licenses: {
          orderBy: { issuedAt: 'desc' },
          select: {
            id: true,
            code: true,
            productSlug: true,
            productName: true,
            status: true,
            issuedAt: true,
            activatedAt: true,
            expiresAt: true,
            linkedAccount: { select: { id: true, label: true, login: true, platform: true } },
          },
        },
        ownedAccounts: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            label: true,
            login: true,
            server: true,
            platform: true,
            status: true,
            currency: true,
            createdAt: true,
          },
        },
        quoteRequests: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          select: {
            id: true,
            reference: true,
            productSlug: true,
            serviceSlug: true,
            status: true,
            createdAt: true,
          },
        },
        sessions: {
          where: { revokedAt: null },
          orderBy: { lastUsedAt: 'desc' },
          take: 10,
          select: { id: true, userAgent: true, ip: true, createdAt: true, lastUsedAt: true },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /** Headline counts for the admin overview. */
  async stats() {
    const [customers, activeCustomers, staff, licenses, activeLicenses, openQuotes] =
      await Promise.all([
        this.prisma.user.count({ where: { role: Role.CUSTOMER } }),
        this.prisma.user.count({ where: { role: Role.CUSTOMER, status: UserStatus.ACTIVE } }),
        this.prisma.user.count({ where: { role: { in: [Role.ADMIN, Role.SUPER_ADMIN] } } }),
        this.prisma.botLicense.count(),
        this.prisma.botLicense.count({ where: { status: 'ACTIVE' } }),
        this.prisma.quoteRequest.count({ where: { status: { in: ['NEW', 'IN_REVIEW'] } } }),
      ]);
    return { customers, activeCustomers, staff, licenses, activeLicenses, openQuotes };
  }

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------

  /**
   * Enable or disable an account.
   *
   * Disabling also pauses the customer's running Expert Advisors and revokes
   * their sessions. A "disabled" account whose bots keep trading and whose
   * browser stays signed in is not disabled in any sense that matters.
   */
  async setStatus(id: string, status: UserStatus, actor: Actor, reason?: string) {
    const target = await this.requireMutable(id, actor);

    const user = await this.prisma.user.update({
      where: { id },
      data: { status },
      select: LIST_VIEW,
    });

    let pausedSubscriptions = 0;
    let revokedSessions = 0;

    if (status === UserStatus.DISABLED) {
      const accounts = await this.prisma.account.findMany({
        where: { ownerId: id, deletedAt: null },
        select: { id: true },
      });
      if (accounts.length > 0) {
        const paused = await this.prisma.subscription.updateMany({
          where: { receiverAccountId: { in: accounts.map((a) => a.id) }, enabled: true },
          data: { enabled: false, status: 'PAUSED' },
        });
        pausedSubscriptions = paused.count;
      }
      const revoked = await this.prisma.session.updateMany({
        where: { userId: id, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      revokedSessions = revoked.count;
      await this.prisma.user.update({ where: { id }, data: { hashedRefreshToken: null } });
    }

    await this.audit.log({
      userId: actor.sub,
      action: status === UserStatus.DISABLED ? 'USER_DISABLED' : 'USER_ENABLED',
      entityType: 'User',
      entityId: id,
      meta: { email: target.email, reason: reason ?? null, pausedSubscriptions, revokedSessions },
    });

    return { user, pausedSubscriptions, revokedSessions };
  }

  /** Sets a new password, ends every session, and emails the user. */
  async resetPassword(id: string, password: string, actor: Actor): Promise<void> {
    const target = await this.requireMutable(id, actor);

    await this.prisma.user.update({
      where: { id },
      data: { passwordHash: await argon2.hash(password), hashedRefreshToken: null },
    });
    await this.prisma.session.updateMany({
      where: { userId: id, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    await this.audit.log({
      userId: actor.sub,
      action: 'USER_PASSWORD_RESET',
      entityType: 'User',
      entityId: id,
      meta: { email: target.email },
    });

    void this.mail.sendPasswordResetNotice(target.email, password);
  }

  /** Signs the user out everywhere without changing their password. */
  async revokeSessions(id: string, actor: Actor): Promise<{ revoked: number }> {
    const target = await this.requireMutable(id, actor);
    const revoked = await this.prisma.session.updateMany({
      where: { userId: id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    await this.prisma.user.update({ where: { id }, data: { hashedRefreshToken: null } });

    await this.audit.log({
      userId: actor.sub,
      action: 'USER_SESSIONS_REVOKED',
      entityType: 'User',
      entityId: id,
      meta: { email: target.email, count: revoked.count },
    });
    return { revoked: revoked.count };
  }

  /**
   * Permanently deletes an account.
   *
   * Refused while the customer still has a connected trading account. Deleting
   * would null the account's owner (onDelete: SetNull) and leave an Expert
   * Advisor trading on a live broker account with nobody attached to it —
   * an orphaned bot placing real trades. Disconnect first, deliberately.
   */
  async remove(id: string, actor: Actor): Promise<void> {
    const target = await this.requireMutable(id, actor);

    const linked = await this.prisma.account.count({
      where: { ownerId: id, deletedAt: null },
    });
    if (linked > 0) {
      throw new ConflictException(
        `This customer still has ${linked} connected trading account${linked === 1 ? '' : 's'}. ` +
          'Disconnect them first — deleting now would leave an Expert Advisor trading on a live account with no owner.',
      );
    }

    await this.prisma.user.delete({ where: { id } });
    await this.audit.log({
      userId: actor.sub,
      action: 'USER_DELETED',
      entityType: 'User',
      entityId: id,
      meta: { email: target.email, role: target.role },
    });
  }

  // -------------------------------------------------------------------------

  /**
   * Guards every mutating action: you cannot act on yourself, and the last
   * active super admin cannot be disabled or removed — that would lock
   * everyone out of the platform with no way back in.
   */
  private async requireMutable(id: string, actor: Actor) {
    const target = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true, status: true },
    });
    if (!target) throw new NotFoundException('User not found');

    if (target.id === actor.sub) {
      throw new BadRequestException(
        'You cannot perform this action on your own account. Ask another super admin.',
      );
    }

    if (target.role === Role.SUPER_ADMIN) {
      if (actor.role !== Role.SUPER_ADMIN) {
        throw new ForbiddenException('Only a super admin can act on another super admin.');
      }
      const others = await this.prisma.user.count({
        where: {
          role: Role.SUPER_ADMIN,
          status: UserStatus.ACTIVE,
          id: { not: target.id },
        },
      });
      if (others === 0) {
        throw new ConflictException(
          'This is the last active super admin. Promote another one before changing this account.',
        );
      }
    }

    return target;
  }
}
