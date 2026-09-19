import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  LicenseStatus,
  Prisma,
  Role,
  SizingMode,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit/audit.service';
import { AccountsService } from '../accounts/accounts.service';
import { CopiersService } from '../copiers/copiers.service';
import { Actor } from '../common/scope';
import { isValidLicenseCode, normalizeLicenseCode } from '../common/license-code';
import { LinkAccountDto } from './dto/link-account.dto';

const LICENSE_VIEW = {
  id: true,
  code: true,
  productSlug: true,
  productName: true,
  status: true,
  issuedAt: true,
  activatedAt: true,
  expiresAt: true,
  linkedAccount: {
    select: { id: true, label: true, login: true, platform: true },
  },
} satisfies Prisma.BotLicenseSelect;

const ACCOUNT_VIEW = {
  id: true,
  label: true,
  login: true,
  server: true,
  platform: true,
  status: true,
  marginMode: true,
  currency: true,
} satisfies Prisma.AccountSelect;

function startOfToday(): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

@Injectable()
export class PortalService {
  private readonly logger = new Logger(PortalService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly accounts: AccountsService,
    private readonly copiers: CopiersService,
  ) {}

  // -------------------------------------------------------------------------
  // Licences
  // -------------------------------------------------------------------------
  listLicenses(actor: Actor) {
    return this.prisma.botLicense.findMany({
      where: { userId: actor.sub },
      orderBy: { issuedAt: 'desc' },
      select: LICENSE_VIEW,
    });
  }

  async getLicense(id: string, actor: Actor) {
    const license = await this.prisma.botLicense.findFirst({
      where: { id, userId: actor.sub },
      select: LICENSE_VIEW,
    });
    if (!license) throw new NotFoundException('Licence not found');
    return license;
  }

  // -------------------------------------------------------------------------
  // Performance
  // -------------------------------------------------------------------------

  /**
   * Headline numbers for one licence.
   *
   * Equity and balance come from the most recent snapshot; today's return is
   * measured against the last snapshot taken before midnight UTC, which is the
   * closest thing we have to an opening figure. With no prior snapshot the
   * return is reported as 0 rather than guessed at.
   */
  async performance(licenseId: string, actor: Actor) {
    const license = await this.prisma.botLicense.findFirst({
      where: { id: licenseId, userId: actor.sub },
      include: { linkedAccount: true },
    });
    if (!license) throw new NotFoundException('Licence not found');
    if (!license.linkedAccount) {
      throw new BadRequestException('This licence is not connected to a trading account yet.');
    }

    const account = license.linkedAccount;
    const midnight = startOfToday();

    const [latest, opening, events, todayEvents] = await Promise.all([
      this.prisma.accountSnapshot.findFirst({
        where: { accountId: account.id },
        orderBy: { ts: 'desc' },
      }),
      this.prisma.accountSnapshot.findFirst({
        where: { accountId: account.id, ts: { lt: midnight } },
        orderBy: { ts: 'desc' },
      }),
      this.prisma.copyEvent.findMany({
        where: { receiverAccountId: account.id, pnl: { not: null } },
        select: { pnl: true, ts: true },
      }),
      this.prisma.copyEvent.count({
        where: { receiverAccountId: account.id, ts: { gte: midnight } },
      }),
    ]);

    const closed = events.map((e) => Number(e.pnl ?? 0));
    const totalPnl = closed.reduce((a, b) => a + b, 0);
    const dailyPnl = events
      .filter((e) => e.ts >= midnight)
      .reduce((a, e) => a + Number(e.pnl ?? 0), 0);
    const wins = closed.filter((v) => v > 0).length;

    const openingEquity = Number(opening?.equity ?? 0);
    const dailyRoiPct = openingEquity > 0 ? (dailyPnl / openingEquity) * 100 : 0;

    const lastTrade = await this.prisma.copyEvent.findFirst({
      where: { receiverAccountId: account.id },
      orderBy: { ts: 'desc' },
      select: { ts: true },
    });

    return {
      licenseId: license.id,
      productName: license.productName,
      accountLabel: account.label,
      currency: account.currency,
      balance: (latest?.balance ?? 0).toString(),
      equity: (latest?.equity ?? 0).toString(),
      dailyRoiPct: Number(dailyRoiPct.toFixed(2)),
      dailyPnl: dailyPnl.toFixed(2),
      totalPnl: totalPnl.toFixed(2),
      openPositions: latest?.openPositions ?? 0,
      trades: closed.length,
      winRate: closed.length ? wins / closed.length : 0,
      lastTradeAt: lastTrade?.ts.toISOString() ?? null,
      tradesToday: todayEvents,
    };
  }

  async overview(actor: Actor) {
    const licenses = await this.prisma.botLicense.findMany({
      where: { userId: actor.sub, status: LicenseStatus.ACTIVE, linkedAccountId: { not: null } },
      select: { id: true },
    });

    const performance = await Promise.all(
      licenses.map((l) => this.performance(l.id, actor).catch(() => null)),
    );
    const rows = performance.filter((p): p is NonNullable<typeof p> => p !== null);

    const linkedAccounts = await this.prisma.account.count({
      where: { ownerId: actor.sub, deletedAt: null },
    });

    const totalEquity = rows.reduce((a, r) => a + Number(r.equity), 0);
    const dailyPnl = rows.reduce((a, r) => a + Number(r.dailyPnl), 0);
    const openingEquity = totalEquity - dailyPnl;

    return {
      activeBots: rows.length,
      linkedAccounts,
      // Mixed-currency portfolios would need conversion; until we support
      // that, report the first account's currency and keep the sum simple.
      currency: rows[0]?.currency ?? 'USD',
      totalEquity: totalEquity.toFixed(2),
      dailyPnl: dailyPnl.toFixed(2),
      dailyRoiPct: openingEquity > 0 ? Number(((dailyPnl / openingEquity) * 100).toFixed(2)) : 0,
      performance: rows,
    };
  }

  /** Every trade the Expert Advisor has placed on the licensed account. */
  async statement(licenseId: string, actor: Actor, limit = 100, offset = 0) {
    const license = await this.prisma.botLicense.findFirst({
      where: { id: licenseId, userId: actor.sub },
      select: { linkedAccountId: true },
    });
    if (!license) throw new NotFoundException('Licence not found');
    if (!license.linkedAccountId) return { items: [], total: 0 };

    const where = { receiverAccountId: license.linkedAccountId };
    const [items, total] = await Promise.all([
      this.prisma.copyEvent.findMany({
        where,
        orderBy: { ts: 'desc' },
        take: Math.min(limit, 500),
        skip: offset,
      }),
      this.prisma.copyEvent.count({ where }),
    ]);
    return { items, total };
  }

  // -------------------------------------------------------------------------
  // Trading accounts
  // -------------------------------------------------------------------------
  listAccounts(actor: Actor) {
    return this.prisma.account.findMany({
      where: { ownerId: actor.sub, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      select: ACCOUNT_VIEW,
    });
  }

  /**
   * Binds a licence to a MetaTrader account and puts the Expert Advisor to
   * work on it.
   *
   * Three things have to happen together: provision the account, attach it to
   * the master that runs this product, and stamp the licence. If the attach
   * fails we soft-delete the account we just made, so a customer never ends up
   * with a connected account that no bot is trading.
   */
  async linkAccount(dto: LinkAccountDto, actor: Actor) {
    const code = normalizeLicenseCode(dto.licenseCode);
    if (!isValidLicenseCode(code)) {
      throw new BadRequestException('That licence code is not valid.');
    }

    const license = await this.prisma.botLicense.findUnique({ where: { code } });
    // Same message either way: a stranger must not be able to probe which
    // codes exist by comparing responses.
    if (!license || license.userId !== actor.sub) {
      throw new NotFoundException('That licence code is not on your account.');
    }
    if (license.linkedAccountId) {
      throw new ConflictException('That licence is already connected to a trading account.');
    }
    if (license.status !== LicenseStatus.UNASSIGNED) {
      throw new ConflictException(`That licence is ${license.status.toLowerCase()} and cannot be connected.`);
    }
    if (license.expiresAt && license.expiresAt < new Date()) {
      throw new ConflictException('That licence has expired.');
    }

    const master = await this.prisma.copierConfig.findFirst({
      where: { productSlug: license.productSlug, enabled: true },
    });
    if (!master) {
      // A configuration gap on our side, not the customer's fault.
      this.logger.error(`No enabled master configured for product "${license.productSlug}"`);
      throw new ConflictException(
        'That Expert Advisor is not accepting new accounts right now. Please contact support.',
      );
    }

    /*
     * The customer owns neither the master nor, yet, the receiver, so the
     * ownership filters inside CopiersService would reject them. We act on
     * their behalf with an elevated actor, but keep their own id so the audit
     * trail still names the person who pressed the button.
     */
    const elevated: Actor = { sub: actor.sub, email: actor.email, role: Role.SUPER_ADMIN };

    const account = await this.accounts.create(
      { label: dto.label, login: dto.login, password: dto.password, server: dto.server, platform: dto.platform },
      elevated,
      actor.sub,
    );

    try {
      const subscription = await this.copiers.addReceiver(
        master.id,
        { receiverAccountId: account.id, sizingMode: SizingMode.BALANCE_RATIO },
        elevated,
      );

      await this.prisma.botLicense.update({
        where: { id: license.id },
        data: {
          linkedAccountId: account.id,
          subscriptionId: subscription.id,
          status: LicenseStatus.ACTIVE,
          activatedAt: new Date(),
        },
      });

      await this.audit.log({
        userId: actor.sub,
        action: 'PORTAL_ACCOUNT_LINKED',
        entityType: 'BotLicense',
        entityId: license.id,
        meta: { accountId: account.id, productSlug: license.productSlug },
      });

      return this.prisma.account.findUniqueOrThrow({
        where: { id: account.id },
        select: ACCOUNT_VIEW,
      });
    } catch (err) {
      // Roll the account back so the customer can retry cleanly.
      await this.accounts.remove(account.id, elevated).catch((cleanupErr) => {
        this.logger.error(
          `Failed to roll back account ${account.id} after a failed link: ${String(cleanupErr)}`,
        );
      });
      throw err;
    }
  }

  /** Disconnects an account and frees its licence to be used again. */
  async unlinkAccount(id: string, actor: Actor): Promise<void> {
    const account = await this.prisma.account.findFirst({
      where: { id, ownerId: actor.sub, deletedAt: null },
      select: { id: true, license: { select: { id: true } } },
    });
    if (!account) throw new NotFoundException('Account not found');

    const elevated: Actor = { sub: actor.sub, email: actor.email, role: Role.SUPER_ADMIN };
    await this.accounts.remove(account.id, elevated);

    if (account.license) {
      await this.prisma.botLicense.update({
        where: { id: account.license.id },
        data: {
          linkedAccountId: null,
          subscriptionId: null,
          status: LicenseStatus.UNASSIGNED,
          activatedAt: null,
        },
      });
    }

    await this.audit.log({
      userId: actor.sub,
      action: 'PORTAL_ACCOUNT_UNLINKED',
      entityType: 'Account',
      entityId: id,
    });
  }

  // -------------------------------------------------------------------------
  // Brokers
  // -------------------------------------------------------------------------
  listBrokers() {
    return this.prisma.brokerOffer.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        logo: true,
        blurb: true,
        signupUrl: true,
        highlights: true,
      },
    });
  }
}
