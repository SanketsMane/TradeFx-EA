import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Resend transport (https://resend.com).
 *
 * A thin fetch wrapper rather than the `resend` SDK — one POST and one GET is
 * not worth a dependency, and this keeps the API key handling in one visible
 * place. The key is read from RESEND_API_KEY, never logged, and never sent
 * anywhere except api.resend.com.
 */
const BASE = 'https://api.resend.com';
const TIMEOUT_MS = 15_000;

export interface ResendSendInput {
  from: string;
  to: string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
}

export interface ResendResult {
  ok: boolean;
  message: string;
  id?: string;
}

@Injectable()
export class ResendService {
  private readonly logger = new Logger(ResendService.name);

  constructor(private readonly config: ConfigService) {}

  private get apiKey(): string | undefined {
    return this.config.get<string>('RESEND_API_KEY')?.trim() || undefined;
  }

  get enabled(): boolean {
    return Boolean(this.apiKey);
  }

  /**
   * The address mail is sent from. Resend will only accept a domain you have
   * verified in your account, so this is configurable and defaults to the
   * platform's own domain.
   */
  get defaultFrom(): string {
    const from = this.config.get<string>('MAIL_FROM')?.trim();
    return from || 'TradeFx <noreply@tradefx.in>';
  }

  async send(input: ResendSendInput): Promise<ResendResult> {
    const apiKey = this.apiKey;
    if (!apiKey) return { ok: false, message: 'Resend is not configured.' };

    // Resend rejects a payload with neither body part.
    if (!input.html && !input.text) {
      return { ok: false, message: 'Refusing to send an email with no body.' };
    }

    let res: Response;
    try {
      res = await fetch(`${BASE}/emails`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: input.from,
          to: input.to,
          subject: input.subject,
          html: input.html,
          text: input.text,
          ...(input.replyTo ? { reply_to: input.replyTo } : {}),
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (e) {
      const why = e instanceof Error ? e.message : 'unknown error';
      return { ok: false, message: `Could not reach Resend: ${why}` };
    }

    const body = (await res.json().catch(() => null)) as
      | { id?: string; message?: string; name?: string }
      | null;

    if (!res.ok) {
      // Surface Resend's own wording — "domain is not verified" is the most
      // common failure and the admin needs to read it verbatim to act on it.
      const detail = body?.message ?? `HTTP ${res.status}`;
      return { ok: false, message: `Resend rejected the email: ${detail}` };
    }

    return { ok: true, message: `Sent to ${input.to.join(', ')}.`, id: body?.id };
  }

  /** Checks the API key and reports which sender domains are usable. */
  async verify(): Promise<ResendResult> {
    const apiKey = this.apiKey;
    if (!apiKey) return { ok: false, message: 'RESEND_API_KEY is not set.' };

    let res: Response;
    try {
      res = await fetch(`${BASE}/domains`, {
        headers: { Authorization: `Bearer ${apiKey}` },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (e) {
      const why = e instanceof Error ? e.message : 'unknown error';
      return { ok: false, message: `Could not reach Resend: ${why}` };
    }

    const body = (await res.json().catch(() => null)) as
      | { data?: { name: string; status: string }[]; message?: string; name?: string }
      | null;

    /*
     * A send-only key is the recommended kind for an application, and it is
     * refused on /domains by design. That is a healthy key, not a bad one —
     * reporting it as rejected would send an admin chasing a non-problem.
     */
    if (body?.name === 'restricted_api_key') {
      return {
        ok: true,
        message:
          'API key valid (send-only, so the sender domain cannot be listed from here). ' +
          'Send a test email to confirm delivery.',
      };
    }

    if (res.status === 401 || res.status === 403) {
      return { ok: false, message: 'Resend rejected the API key.' };
    }

    if (!res.ok) {
      return { ok: false, message: body?.message ?? `Resend returned HTTP ${res.status}.` };
    }

    const domains = body?.data ?? [];
    const verified = domains.filter((d) => d.status === 'verified').map((d) => d.name);

    if (verified.length === 0) {
      const pending = domains.map((d) => `${d.name} (${d.status})`).join(', ');
      return {
        ok: false,
        message: domains.length
          ? `API key works, but no domain is verified yet: ${pending}. Email will be rejected until one is.`
          : 'API key works, but no sender domain has been added in Resend yet.',
      };
    }

    return { ok: true, message: `API key valid. Verified sender domains: ${verified.join(', ')}.` };
  }
}
