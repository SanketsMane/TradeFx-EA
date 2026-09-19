import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Renflair SMS gateway (sms.renflair.in).
 *
 * Every endpoint is a GET with the API key in the query string, so the key
 * must never reach the browser — all calls happen here, server-side, and the
 * key is read from SMS_API_KEY. It is never logged, and neither is an OTP.
 *
 * The gateway is India-only and expects a bare 10-digit national number.
 */
const BASE = 'https://sms.renflair.in';
const TIMEOUT_MS = 10_000;

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor(private readonly config: ConfigService) {}

  private get apiKey(): string | undefined {
    return this.config.get<string>('SMS_API_KEY')?.trim() || undefined;
  }

  private get isProduction(): boolean {
    return this.config.get<string>('NODE_ENV') === 'production';
  }

  get enabled(): boolean {
    return Boolean(this.apiKey);
  }

  /**
   * Sends a verification code (gateway endpoint V1).
   *
   * With no API key configured we refuse in production and fall back to
   * printing the code to the server log in development, so the flow can be
   * exercised locally without SMS credits. The code is only ever written to
   * the log — it is never returned in the HTTP response, in any environment.
   */
  async sendOtp(phone: string, code: string): Promise<void> {
    if (!this.enabled) {
      if (this.isProduction) {
        this.logger.error('SMS_API_KEY is not set — cannot send verification codes.');
        throw new ServiceUnavailableException(
          'Text messaging is unavailable right now. Please sign in with your email instead.',
        );
      }
      this.logger.warn(
        `SMS_API_KEY not set. DEV ONLY — verification code for ${this.mask(phone)} is ${code}`,
      );
      return;
    }

    await this.call('V1.php', { PHONE: phone, OTP: code }, 'otp');
  }

  // -------------------------------------------------------------------------
  // Remaining gateway endpoints.
  //
  // These are implemented so the integration is complete, but nothing calls
  // them yet — TradeFx has no order, wallet or service-booking flow for them
  // to hang off. Wire each one up when the matching feature exists rather than
  // sending a customer an SMS whose wording does not match what happened.
  // -------------------------------------------------------------------------

  /** V3 — "Your order ID {orderId} has been placed Successfully." */
  async sendOrderPlaced(phone: string, orderId: string, customerName: string): Promise<void> {
    await this.call('V3.php', { PHONE: phone, OID: orderId, CNAME: customerName }, 'order-placed');
  }

  /** V4 — notifies a partner that order {orderId} has come in. */
  async sendPartnerNewOrder(phone: string, orderId: string): Promise<void> {
    await this.call('V4.php', { PHONE: phone, OID: orderId }, 'partner-new-order');
  }

  /** V6 — "Your Wallet has been Recharged Successfully with {amount}." */
  async sendWalletRecharged(phone: string, amount: string): Promise<void> {
    await this.call('V6.php', { PHONE: phone, AMT: amount }, 'wallet-recharged');
  }

  /** V7 — service booking confirmed, processed within {hours} hours. */
  async sendServiceBooked(phone: string, orderId: string, hours: number): Promise<void> {
    await this.call('V7.php', { PHONE: phone, OID: orderId, HOUR: String(hours) }, 'service-booked');
  }

  // -------------------------------------------------------------------------

  private async call(
    endpoint: string,
    params: Record<string, string>,
    label: string,
  ): Promise<void> {
    const apiKey = this.apiKey;
    if (!apiKey) {
      throw new ServiceUnavailableException('Text messaging is not configured.');
    }

    const url = new URL(`${BASE}/${endpoint}`);
    url.searchParams.set('API', apiKey);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

    let res: Response;
    try {
      res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    } catch (err) {
      // Never interpolate `url` — it carries the API key.
      this.logger.error(`SMS ${label} request failed: ${err instanceof Error ? err.message : err}`);
      throw new ServiceUnavailableException(
        'We could not send the text message. Please try again in a moment.',
      );
    }

    const body = await res.text().catch(() => '');
    if (!res.ok) {
      this.logger.error(`SMS ${label} returned HTTP ${res.status}: ${body.slice(0, 200)}`);
      throw new ServiceUnavailableException(
        'We could not send the text message. Please try again in a moment.',
      );
    }

    // The gateway answers 200 with a JSON body even on failure, so the status
    // alone is not enough.
    const ok = SmsService.looksSuccessful(body);
    if (!ok) {
      this.logger.error(`SMS ${label} rejected: ${body.slice(0, 200)}`);
      throw new ServiceUnavailableException(
        'We could not send the text message. Please check the number and try again.',
      );
    }
  }

  /**
   * The gateway's payload is loosely specified, so treat anything that is not
   * an explicit failure as sent, and log the body when we bail out.
   */
  private static looksSuccessful(body: string): boolean {
    const text = body.trim();
    if (!text) return true;
    try {
      const json = JSON.parse(text) as Record<string, unknown>;
      const status = String(json.status ?? json.Status ?? '').toLowerCase();
      if (status) return status === 'success' || status === 'true' || status === '1';
      return true;
    } catch {
      return !/error|invalid|fail/i.test(text);
    }
  }

  /** Last two digits only — enough to correlate a log line, not to identify. */
  private mask(phone: string): string {
    return `${'*'.repeat(Math.max(0, phone.length - 2))}${phone.slice(-2)}`;
  }
}
