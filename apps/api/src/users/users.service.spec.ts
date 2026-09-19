import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Role, UserStatus } from '@prisma/client';
import { UsersService } from './users.service';
import { Actor } from '../common/scope';

/**
 * These cover the ways an admin action can do real damage: locking every
 * super admin out of the platform, or deleting a customer and leaving an
 * Expert Advisor trading on a live broker account with no owner.
 */
const SUPER: Actor = { sub: 'me', email: 'me@x.com', role: Role.SUPER_ADMIN };
const ADMIN: Actor = { sub: 'admin', email: 'a@x.com', role: Role.ADMIN };

function harness(opts: {
  target?: { id: string; email: string; role: Role; status: UserStatus } | null;
  otherActiveSupers?: number;
  linkedAccounts?: number;
} = {}) {
  const target =
    opts.target === undefined
      ? { id: 'u1', email: 'cust@x.com', role: Role.CUSTOMER, status: UserStatus.ACTIVE }
      : opts.target;

  const updated: Record<string, unknown>[] = [];
  const prisma = {
    user: {
      findUnique: jest.fn().mockResolvedValue(target),
      count: jest.fn().mockResolvedValue(opts.otherActiveSupers ?? 1),
      update: jest.fn((args: any) => {
        updated.push(args.data);
        return Promise.resolve({ ...target, ...args.data });
      }),
      delete: jest.fn().mockResolvedValue(target),
    },
    account: {
      count: jest.fn().mockResolvedValue(opts.linkedAccounts ?? 0),
      findMany: jest.fn().mockResolvedValue(
        Array.from({ length: opts.linkedAccounts ?? 0 }, (_, i) => ({ id: `acc${i}` })),
      ),
    },
    subscription: { updateMany: jest.fn().mockResolvedValue({ count: 2 }) },
    session: { updateMany: jest.fn().mockResolvedValue({ count: 3 }) },
  };
  const audit = { log: jest.fn().mockResolvedValue(undefined) };
  const mail = { sendPasswordResetNotice: jest.fn().mockResolvedValue({ ok: true }) };
  const service = new UsersService(prisma as any, audit as any, mail as any);
  return { service, prisma, audit, mail, updated };
}

describe('UsersService', () => {
  describe('guards on every mutating action', () => {
    it('refuses to act on your own account', async () => {
      const { service } = harness({
        target: { id: 'me', email: 'me@x.com', role: Role.SUPER_ADMIN, status: UserStatus.ACTIVE },
      });
      await expect(service.setStatus('me', UserStatus.DISABLED, SUPER)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('refuses when the user does not exist', async () => {
      const { service } = harness({ target: null });
      await expect(service.setStatus('nope', UserStatus.DISABLED, SUPER)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('stops a plain admin acting on a super admin', async () => {
      const { service } = harness({
        target: { id: 'u2', email: 's@x.com', role: Role.SUPER_ADMIN, status: UserStatus.ACTIVE },
      });
      await expect(service.setStatus('u2', UserStatus.DISABLED, ADMIN)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });

    it('refuses to disable the last active super admin', async () => {
      const { service } = harness({
        target: { id: 'u2', email: 's@x.com', role: Role.SUPER_ADMIN, status: UserStatus.ACTIVE },
        otherActiveSupers: 0,
      });
      await expect(service.setStatus('u2', UserStatus.DISABLED, SUPER)).rejects.toThrow(
        /last active super admin/i,
      );
    });

    it('allows acting on a super admin while another active one remains', async () => {
      const { service } = harness({
        target: { id: 'u2', email: 's@x.com', role: Role.SUPER_ADMIN, status: UserStatus.ACTIVE },
        otherActiveSupers: 1,
      });
      await expect(service.setStatus('u2', UserStatus.DISABLED, SUPER)).resolves.toBeDefined();
    });
  });

  describe('disabling an account', () => {
    it('pauses their Expert Advisors and signs them out', async () => {
      const { service, prisma } = harness({ linkedAccounts: 2 });
      const r = await service.setStatus('u1', UserStatus.DISABLED, SUPER, 'chargeback');

      expect(prisma.subscription.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({ data: { enabled: false, status: 'PAUSED' } }),
      );
      expect(prisma.session.updateMany).toHaveBeenCalled();
      expect(r.pausedSubscriptions).toBe(2);
      expect(r.revokedSessions).toBe(3);
    });

    it('records the reason in the audit log', async () => {
      const { service, audit } = harness();
      await service.setStatus('u1', UserStatus.DISABLED, SUPER, 'chargeback');
      expect(audit.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'USER_DISABLED',
          meta: expect.objectContaining({ reason: 'chargeback' }),
        }),
      );
    });

    it('does not touch subscriptions when re-enabling', async () => {
      const { service, prisma } = harness();
      await service.setStatus('u1', UserStatus.ACTIVE, SUPER);
      // Re-enabling restores sign-in only; restarting a bot is a deliberate act.
      expect(prisma.subscription.updateMany).not.toHaveBeenCalled();
    });
  });

  describe('deleting an account', () => {
    it('refuses while a trading account is still connected', async () => {
      const { service, prisma } = harness({ linkedAccounts: 1 });
      await expect(service.remove('u1', SUPER)).rejects.toBeInstanceOf(ConflictException);
      await expect(service.remove('u1', SUPER)).rejects.toThrow(/disconnect them first/i);
      expect(prisma.user.delete).not.toHaveBeenCalled();
    });

    it('deletes once nothing is connected', async () => {
      const { service, prisma, audit } = harness({ linkedAccounts: 0 });
      await service.remove('u1', SUPER);
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'u1' } });
      expect(audit.log).toHaveBeenCalledWith(expect.objectContaining({ action: 'USER_DELETED' }));
    });
  });

  describe('password reset', () => {
    it('ends every session so the old password cannot be refreshed', async () => {
      const { service, prisma, updated } = harness();
      await service.resetPassword('u1', 'NewPass#123', SUPER);
      expect(prisma.session.updateMany).toHaveBeenCalled();
      expect(updated.some((d) => d.hashedRefreshToken === null)).toBe(true);
    });

    it('stores a hash, never the plaintext', async () => {
      const { service, updated } = harness();
      await service.resetPassword('u1', 'NewPass#123', SUPER);
      const hash = updated.find((d) => d.passwordHash)?.passwordHash as string;
      expect(hash).toMatch(/^\$argon2/);
      expect(hash).not.toContain('NewPass#123');
    });

    it('emails the user their new password', async () => {
      const { service, mail } = harness();
      await service.resetPassword('u1', 'NewPass#123', SUPER);
      expect(mail.sendPasswordResetNotice).toHaveBeenCalledWith('cust@x.com', 'NewPass#123');
    });
  });
});
