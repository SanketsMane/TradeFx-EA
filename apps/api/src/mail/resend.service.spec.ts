import { ConfigService } from '@nestjs/config';
import { ResendService } from './resend.service';

/**
 * Focus: that a failure is reported as a failure. Email is best-effort, so a
 * transport that quietly returns "ok" on a rejected send would hide a broken
 * password-reset flow until a customer complained.
 */
function makeService(env: Record<string, string | undefined> = {}) {
  const config = {
    get: (k: string, d?: unknown) => (k in env ? env[k] : d),
  } as unknown as ConfigService;
  return new ResendService(config);
}

const KEY = { RESEND_API_KEY: 're_test_key' };

function mockFetch(status: number, body: unknown) {
  const fn = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response);
  global.fetch = fn as unknown as typeof fetch;
  return fn;
}

describe('ResendService', () => {
  afterEach(() => jest.restoreAllMocks());

  describe('configuration', () => {
    it('is disabled without a key', () => {
      expect(makeService().enabled).toBe(false);
    });

    it('is enabled with one, and ignores whitespace-only keys', () => {
      expect(makeService(KEY).enabled).toBe(true);
      expect(makeService({ RESEND_API_KEY: '   ' }).enabled).toBe(false);
    });

    it('falls back to the platform sender when MAIL_FROM is unset', () => {
      expect(makeService(KEY).defaultFrom).toBe('TradeFx <noreply@tradefx.in>');
      expect(makeService({ ...KEY, MAIL_FROM: 'A <a@b.com>' }).defaultFrom).toBe('A <a@b.com>');
    });
  });

  describe('send', () => {
    const mail = { from: 'A <a@b.com>', to: ['x@y.com'], subject: 'Hi', text: 'Body' };

    it('refuses when no key is configured', async () => {
      const r = await makeService().send(mail);
      expect(r.ok).toBe(false);
      expect(r.message).toMatch(/not configured/i);
    });

    it('refuses an email with no body rather than sending a blank one', async () => {
      const fn = mockFetch(200, { id: 'x' });
      const r = await makeService(KEY).send({ from: 'a', to: ['x@y.com'], subject: 'S' });
      expect(r.ok).toBe(false);
      expect(fn).not.toHaveBeenCalled();
    });

    it('posts to the emails endpoint with bearer auth', async () => {
      const fn = mockFetch(200, { id: 'msg_1' });
      const r = await makeService(KEY).send(mail);

      expect(r.ok).toBe(true);
      expect(r.id).toBe('msg_1');
      const [url, init] = fn.mock.calls[0];
      expect(String(url)).toBe('https://api.resend.com/emails');
      expect(init.method).toBe('POST');
      expect(init.headers.Authorization).toBe('Bearer re_test_key');
      expect(JSON.parse(init.body)).toMatchObject({ to: ['x@y.com'], subject: 'Hi' });
    });

    it('surfaces an unverified-domain rejection verbatim', async () => {
      mockFetch(403, { message: 'The tradefx.in domain is not verified.', name: 'validation_error' });
      const r = await makeService(KEY).send(mail);
      expect(r.ok).toBe(false);
      expect(r.message).toContain('domain is not verified');
    });

    it('reports a network failure instead of claiming success', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('ETIMEDOUT')) as unknown as typeof fetch;
      const r = await makeService(KEY).send(mail);
      expect(r.ok).toBe(false);
      expect(r.message).toMatch(/could not reach resend/i);
    });

    it('never puts the API key in the returned message', async () => {
      mockFetch(500, { message: 'boom' });
      const r = await makeService(KEY).send(mail);
      expect(r.message).not.toContain('re_test_key');
    });
  });

  describe('verify', () => {
    it('accepts a send-only key, which cannot list domains by design', async () => {
      mockFetch(401, {
        statusCode: 401,
        message: 'This API key is restricted to only send emails',
        name: 'restricted_api_key',
      });
      const r = await makeService(KEY).verify();
      expect(r.ok).toBe(true);
      expect(r.message).toMatch(/send-only/i);
    });

    it('reports a bad key', async () => {
      mockFetch(401, { message: 'invalid' });
      const r = await makeService(KEY).verify();
      expect(r.ok).toBe(false);
      expect(r.message).toMatch(/rejected the api key/i);
    });

    it('fails when the key works but no domain is verified', async () => {
      mockFetch(200, { data: [{ name: 'tradefx.in', status: 'pending' }] });
      const r = await makeService(KEY).verify();
      expect(r.ok).toBe(false);
      expect(r.message).toMatch(/tradefx\.in \(pending\)/);
    });

    it('fails when no domain has been added at all', async () => {
      mockFetch(200, { data: [] });
      const r = await makeService(KEY).verify();
      expect(r.ok).toBe(false);
      expect(r.message).toMatch(/no sender domain/i);
    });

    it('passes once a domain is verified', async () => {
      mockFetch(200, {
        data: [
          { name: 'tradefx.in', status: 'verified' },
          { name: 'old.example', status: 'pending' },
        ],
      });
      const r = await makeService(KEY).verify();
      expect(r.ok).toBe(true);
      expect(r.message).toContain('tradefx.in');
      expect(r.message).not.toContain('old.example');
    });
  });
});
