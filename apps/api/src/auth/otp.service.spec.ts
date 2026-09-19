import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Role, UserStatus } from '@prisma/client';
import * as argon2 from 'argon2';
import { OtpService } from './otp.service';

/**
 * Covers the paths that decide whether someone gets into an account:
 * expiry, single use, guess limits, and the rule that a correct code for an
 * unknown number does not silently create a nameless account.
 */
type Challenge = {
  id: string;
  phone: string;
  codeHash: string;
  expiresAt: Date;
  attempts: number;
  consumedAt: Date | null;
  createdAt: Date;
  ip?: string | null;
};

function makeHarness() {
  const challenges: Challenge[] = [];
  const users: Record<string, unknown>[] = [];
  const sent: { phone: string; code: string }[] = [];
  let seq = 0;

  const prisma = {
    otpChallenge: {
      findFirst: jest.fn(({ where, orderBy }: any) => {
        let rows = challenges.filter((c) => c.phone === where.phone);
        if (where.consumedAt === null) rows = rows.filter((c) => c.consumedAt === null);
        if (where.expiresAt?.gt) rows = rows.filter((c) => c.expiresAt > where.expiresAt.gt);
        if (where.createdAt?.gt) rows = rows.filter((c) => c.createdAt > where.createdAt.gt);
        rows = [...rows].sort((a, b) =>
          orderBy?.createdAt === 'desc'
            ? b.createdAt.getTime() - a.createdAt.getTime()
            : a.createdAt.getTime() - b.createdAt.getTime(),
        );
        return Promise.resolve(rows[0] ?? null);
      }),
      create: jest.fn(({ data }: any) => {
        const row: Challenge = { id: `c${++seq}`, attempts: 0, consumedAt: null, createdAt: new Date(), ...data };
        challenges.push(row);
        return Promise.resolve(row);
      }),
      update: jest.fn(({ where, data }: any) => {
        const row = challenges.find((c) => c.id === where.id)!;
        if (data.consumedAt) row.consumedAt = data.consumedAt;
        if (data.attempts?.increment) row.attempts += data.attempts.increment;
        return Promise.resolve(row);
      }),
      updateMany: jest.fn(({ where, data }: any) => {
        let n = 0;
        for (const c of challenges) {
          if (c.phone === where.phone && c.consumedAt === null) {
            c.consumedAt = data.consumedAt;
            n++;
          }
        }
        return Promise.resolve({ count: n });
      }),
    },
    user: {
      findUnique: jest.fn(({ where }: any) =>
        Promise.resolve(users.find((u) => u.phone === where.phone) ?? null),
      ),
      create: jest.fn(({ data }: any) => {
        const row = { id: `u${++seq}`, status: UserStatus.ACTIVE, ...data };
        users.push(row);
        return Promise.resolve(row);
      }),
    },
  };

  const audit = { log: jest.fn().mockResolvedValue(undefined) };
  const sms = {
    sendOtp: jest.fn((phone: string, code: string) => {
      sent.push({ phone, code });
      return Promise.resolve();
    }),
  };
  const auth = {
    startSession: jest.fn((user: any) =>
      Promise.resolve({ accessToken: 'a', refreshToken: 'r', user: { id: user.id } }),
    ),
  };

  const service = new OtpService(prisma as any, audit as any, sms as any, auth as any);
  return { service, prisma, sms, auth, challenges, users, sent };
}

const PHONE = '9876543210';

describe('OtpService', () => {
  jest.setTimeout(30_000);

  describe('request', () => {
    it('rejects a number the SMS gateway could not deliver to', async () => {
      const { service, sms } = makeHarness();
      await expect(service.request('12345')).rejects.toBeInstanceOf(BadRequestException);
      expect(sms.sendOtp).not.toHaveBeenCalled();
    });

    it('sends a 6-digit code and never stores it in the clear', async () => {
      const { service, sent, challenges } = makeHarness();
      await service.request(PHONE);

      expect(sent).toHaveLength(1);
      expect(sent[0].code).toMatch(/^\d{6}$/);
      expect(challenges[0].codeHash).not.toContain(sent[0].code);
      await expect(argon2.verify(challenges[0].codeHash, sent[0].code)).resolves.toBe(true);
    });

    it('accepts the number in any written form', async () => {
      const { service, sent } = makeHarness();
      await service.request('+91 98765 43210');
      expect(sent[0].phone).toBe(PHONE);
    });

    it('refuses a second code inside the cooldown', async () => {
      const { service, sms } = makeHarness();
      await service.request(PHONE);
      await expect(service.request(PHONE)).rejects.toBeInstanceOf(BadRequestException);
      expect(sms.sendOtp).toHaveBeenCalledTimes(1);
    });

    it('invalidates the previous code when a new one is issued', async () => {
      const { service, challenges, sent } = makeHarness();
      await service.request(PHONE);
      // Step past the cooldown.
      challenges[0].createdAt = new Date(Date.now() - 120_000);
      await service.request(PHONE);

      expect(challenges[0].consumedAt).not.toBeNull();
      // The old code no longer works.
      await expect(service.verify(PHONE, sent[0].code, 'Test User')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });

  describe('verify', () => {
    it('rejects when there is no outstanding code', async () => {
      const { service } = makeHarness();
      await expect(service.verify(PHONE, '123456', 'Test User')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('rejects an expired code', async () => {
      const { service, challenges, sent } = makeHarness();
      await service.request(PHONE);
      challenges[0].expiresAt = new Date(Date.now() - 1000);
      await expect(service.verify(PHONE, sent[0].code, 'Test User')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('counts wrong guesses and locks the challenge after five', async () => {
      const { service, challenges, sent } = makeHarness();
      await service.request(PHONE);
      const wrong = sent[0].code === '000000' ? '111111' : '000000';

      for (let i = 0; i < 5; i++) {
        await expect(service.verify(PHONE, wrong, 'Test User')).rejects.toBeInstanceOf(
          UnauthorizedException,
        );
      }
      expect(challenges[0].attempts).toBe(5);

      // Even the right code is refused now, and the challenge is burned.
      await expect(service.verify(PHONE, sent[0].code, 'Test User')).rejects.toThrow(
        /too many incorrect attempts/i,
      );
      expect(challenges[0].consumedAt).not.toBeNull();
    });

    it('cannot be replayed once used', async () => {
      const { service, sent } = makeHarness();
      await service.request(PHONE);
      await service.verify(PHONE, sent[0].code, 'Test User');
      await expect(service.verify(PHONE, sent[0].code, 'Test User')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('creates a customer account for a new number', async () => {
      const { service, sent, users, auth } = makeHarness();
      await service.request(PHONE);
      const res = await service.verify(PHONE, sent[0].code, 'Asha Patel');

      expect(res.status).toBe('SIGNED_IN');
      expect(users).toHaveLength(1);
      expect(users[0]).toMatchObject({ role: Role.CUSTOMER, fullName: 'Asha Patel', phone: PHONE });
      expect(auth.startSession).toHaveBeenCalled();
    });

    it('asks for a name rather than creating a nameless account', async () => {
      const { service, sent, users, challenges } = makeHarness();
      await service.request(PHONE);
      const res = await service.verify(PHONE, sent[0].code, undefined);

      expect(res).toEqual({ status: 'PROFILE_REQUIRED', phone: PHONE });
      expect(users).toHaveLength(0);
      // The challenge stays live so the sign-up form can finish with a name.
      expect(challenges[0].consumedAt).toBeNull();

      const done = await service.verify(PHONE, sent[0].code, 'Asha Patel');
      expect(done.status).toBe('SIGNED_IN');
      expect(users).toHaveLength(1);
    });

    it('signs in an existing number instead of creating a second account', async () => {
      const { service, sent, users, prisma } = makeHarness();
      users.push({ id: 'existing', phone: PHONE, status: UserStatus.ACTIVE, role: Role.CUSTOMER });
      await service.request(PHONE);

      const res = await service.verify(PHONE, sent[0].code, 'Ignored Name');
      expect(res.status).toBe('SIGNED_IN');
      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(users).toHaveLength(1);
    });

    it('refuses a disabled account', async () => {
      const { service, sent, users } = makeHarness();
      users.push({ id: 'off', phone: PHONE, status: UserStatus.DISABLED, role: Role.CUSTOMER });
      await service.request(PHONE);

      await expect(service.verify(PHONE, sent[0].code, undefined)).rejects.toThrow(/disabled/i);
    });
  });
});
