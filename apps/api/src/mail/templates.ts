/**
 * TradeFx transactional email templates.
 *
 * Table-based, inline-CSS, tested-shape HTML for Gmail, Apple Mail, Outlook
 * (Word engine), Yahoo and mobile clients.
 *
 * Design decisions, made deliberately rather than inherited:
 *
 * - **Flat surfaces, 1px borders, 8px radius.** No drop shadows (most clients
 *   drop them anyway) and no 18px pill-corners — those read as consumer app,
 *   not as a financial notice.
 * - **One accent.** Brand orange is reserved for the primary call to action
 *   and the logo. It is never used to signal status, because a colour that
 *   means two things means nothing.
 * - **Status is never colour alone.** Every state carries a written label in a
 *   tinted pill, so it survives greyscale, colourblindness and image blocking.
 * - **No emoji.** They render as flat monochrome in Outlook, full-colour in
 *   Gmail and sometimes as tofu — an inconsistent icon set by definition.
 * - **Light scheme only, declared.** Email clients invert dark mode crudely
 *   and routinely wreck tinted panels; we opt out rather than ship something
 *   we cannot verify in every client.
 * - **Codes and identifiers are monospace with tabular figures**, never
 *   truncated, and always repeated in the plain-text part so they survive
 *   any rendering failure.
 *
 * Every template returns a plain-text alternative as well. That is not a
 * formality: it is what screen readers, plain-text clients and spam filters
 * actually read.
 */

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

/**
 * Semantic tokens. Status colours follow the platform palette and each has a
 * tinted background plus a foreground that clears 4.5:1 on it.
 */
const C = {
  text: '#101828',
  body: '#344054',
  muted: '#667085',
  faint: '#98A2B3',
  border: '#E4E7EC',
  borderStrong: '#D0D5DD',
  canvas: '#F2F4F7',
  surface: '#FFFFFF',
  sunken: '#F9FAFB',

  // The single accent — primary action and brand only.
  brand: '#E35728',
  brandHover: '#B8431B',
  brandText: '#B8431B', // 5.45:1 on white; the 600 tint is not AA for small text
  brandTint: '#FFF5F1',
  brandBorder: '#FFCDB8',

  successText: '#067647',
  successTint: '#ECFDF3',
  successBorder: '#ABEFC6',

  warningText: '#B54708',
  warningTint: '#FFFAEB',
  warningBorder: '#FEDF89',

  errorText: '#B42318',
  errorTint: '#FEF3F2',
  errorBorder: '#FECDCA',

  infoText: '#175CD3',
  infoTint: '#EFF8FF',
  infoBorder: '#B2DDFF',
};

const FONT =
  "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const MONO = "'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace";

/**
 * Escapes every character that can break out of HTML text or an attribute.
 * The single quote is included even though nothing currently interpolates
 * into a single-quoted attribute — it costs one character, and the failure
 * mode if someone later adds one is an injection.
 */
function esc(s: string): string {
  return String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
}

function spacer(h: number): string {
  return `<tr><td style="height:${h}px;line-height:${h}px;font-size:1px;">&nbsp;</td></tr>`;
}

function rule(top = 28, bottom = 28): string {
  return `<tr><td style="padding:${top}px 0 ${bottom}px;"><div style="height:1px;line-height:1px;font-size:1px;background:${C.border};">&nbsp;</div></td></tr>`;
}

// ---------------------------------------------------------------------------
// Shell
// ---------------------------------------------------------------------------

function shell(preheader: string, inner: string): string {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="https://www.w3.org/1999/xhtml" lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="color-scheme" content="light only" />
<meta name="supported-color-schemes" content="light" />
<title>TradeFx</title>
<!--[if mso]><style>* { font-family: Arial, Helvetica, sans-serif !important; }</style><![endif]-->
<style>
  body { margin:0; padding:0; background:${C.canvas}; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  table { border-collapse:collapse; }
  img { border:0; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }
  a { text-decoration:none; }
  .btn:hover { background:${C.brandHover} !important; }
  @media only screen and (max-width:600px) {
    .card { width:100% !important; border-radius:0 !important; border-left:0 !important; border-right:0 !important; }
    .px { padding-left:24px !important; padding-right:24px !important; }
    .h1 { font-size:24px !important; line-height:31px !important; }
    .code { font-size:24px !important; letter-spacing:0.12em !important; }
    .lbl { width:104px !important; }
    .cta { width:100% !important; }
    .cta a { display:block !important; text-align:center !important; padding-left:0 !important; padding-right:0 !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.canvas};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;font-size:1px;line-height:1px;color:${C.canvas};">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.canvas}" style="background:${C.canvas};">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" class="card" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:${C.surface};border:1px solid ${C.border};border-radius:8px;">
      <tr><td class="px" style="padding:36px 40px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          ${inner}
        </table>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

/**
 * Brand lockup, left-aligned. Falls back to an orange "T" tile when images are
 * blocked, which is the default in Outlook and for many Gmail users.
 */
function header(logoUrl: string | null): string {
  const mark = logoUrl
    ? `<img src="${esc(logoUrl)}" width="32" height="32" alt="TradeFx" style="display:block;width:32px;height:32px;border:0;outline:none;" />`
    : `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td align="center" valign="middle" width="32" height="32" style="width:32px;height:32px;background:${C.brand};border-radius:6px;color:#ffffff;font-family:${FONT};font-size:18px;font-weight:700;text-align:center;line-height:32px;">T</td>
      </tr></table>`;
  return `<tr><td style="padding-bottom:24px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td valign="middle" style="padding-right:10px;">${mark}</td>
      <td valign="middle" style="font-family:${FONT};font-size:17px;font-weight:700;color:${C.text};letter-spacing:-0.01em;">TradeFx</td>
    </tr></table>
  </td></tr>`;
}

function footer(url: string | null, extra?: string): string {
  const link = url
    ? `<tr><td style="font-family:${FONT};font-size:12px;line-height:18px;color:${C.muted};padding-top:6px;">
         <a href="${esc(url)}" target="_blank" style="color:${C.brandText};font-weight:600;">${esc(url.replace(/^https?:\/\//, ''))}</a>
       </td></tr>`
    : '';
  const note = extra
    ? `<tr><td style="font-family:${FONT};font-size:12px;line-height:18px;color:${C.muted};padding-top:10px;">${extra}</td></tr>`
    : '';
  return `${rule(28, 18)}
  <tr><td style="font-family:${FONT};font-size:13px;font-weight:700;color:${C.text};">TradeFx</td></tr>
  <tr><td style="font-family:${FONT};font-size:12px;line-height:18px;color:${C.muted};padding-top:2px;">MT4 &amp; MT5 Expert Advisor platform</td></tr>
  ${link}
  ${note}
  ${spacer(12)}
  <tr><td style="font-family:${FONT};font-size:11px;line-height:17px;color:${C.faint};">
    Automated message — replies to this address are not monitored.<br />
    Trading foreign exchange on margin carries a high level of risk and can result in the loss of more than your deposit.
  </td></tr>
  <tr><td style="font-family:${FONT};font-size:11px;color:${C.faint};padding-top:6px;">&copy; ${new Date().getFullYear()} TradeFx. All rights reserved.</td></tr>`;
}

// ---------------------------------------------------------------------------
// Content blocks
// ---------------------------------------------------------------------------

type Tone = 'brand' | 'success' | 'warning' | 'error' | 'info';

const TONE: Record<Tone, { fg: string; bg: string; bd: string }> = {
  brand: { fg: C.brandText, bg: C.brandTint, bd: C.brandBorder },
  success: { fg: C.successText, bg: C.successTint, bd: C.successBorder },
  warning: { fg: C.warningText, bg: C.warningTint, bd: C.warningBorder },
  error: { fg: C.errorText, bg: C.errorTint, bd: C.errorBorder },
  info: { fg: C.infoText, bg: C.infoTint, bd: C.infoBorder },
};

/** Status pill. Written label, so the state survives greyscale and colourblindness. */
function pill(label: string, tone: Tone): string {
  const t = TONE[tone];
  return `<tr><td style="padding-bottom:14px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="background:${t.bg};border:1px solid ${t.bd};border-radius:6px;padding:5px 10px;font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${t.fg};">${esc(label)}</td>
    </tr></table>
  </td></tr>`;
}

function heading(title: string, subtitle?: string): string {
  const sub = subtitle
    ? `<tr><td style="font-family:${FONT};font-size:15px;line-height:23px;color:${C.body};padding-top:10px;">${subtitle}</td></tr>`
    : '';
  return `<tr><td class="h1" style="font-family:${FONT};font-size:27px;line-height:34px;font-weight:700;color:${C.text};letter-spacing:-0.02em;">${esc(title)}</td></tr>${sub}`;
}

function paragraph(html: string, topPad = 16): string {
  return `<tr><td style="font-family:${FONT};font-size:15px;line-height:23px;color:${C.body};padding-top:${topPad}px;">${html}</td></tr>`;
}

/** Bulletproof primary CTA, left-aligned, with an Outlook VML fallback. */
function button(label: string, href: string): string {
  const safe = esc(href || '#');
  return `<tr><td style="padding-top:26px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="cta"><tr>
      <td bgcolor="${C.brand}" style="border-radius:6px;">
        <!--[if mso]>
        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${safe}" style="height:46px;v-text-anchor:middle;width:260px;" arcsize="13%" strokecolor="${C.brand}" fillcolor="${C.brand}">
        <w:anchorlock/><center style="color:#ffffff;font-family:${FONT};font-size:15px;font-weight:600;">${esc(label)}</center>
        </v:roundrect>
        <![endif]-->
        <!--[if !mso]><!-- -->
        <a href="${safe}" target="_blank" class="btn" style="display:inline-block;background:${C.brand};color:#ffffff;font-family:${FONT};font-size:15px;font-weight:600;line-height:20px;text-decoration:none;padding:13px 26px;border-radius:6px;mso-padding-alt:0;">${esc(label)}</a>
        <!--<![endif]-->
      </td>
    </tr></table>
  </td></tr>`;
}

/** Fallback URL line — a button alone strands anyone whose client blocks it. */
function linkFallback(href: string): string {
  return `<tr><td style="font-family:${FONT};font-size:12px;line-height:19px;color:${C.muted};padding-top:14px;word-break:break-all;">
    If the button does not work, copy this link into your browser:<br />
    <a href="${esc(href)}" target="_blank" style="color:${C.brandText};">${esc(href)}</a>
  </td></tr>`;
}

/** Label/value table. Values are never truncated. */
function details(rows: Array<[string, string]>, opts: { mono?: boolean } = {}): string {
  const body = rows
    .map(
      ([k, v], i) => `<tr>
        <td width="150" valign="top" class="lbl" style="width:150px;padding:${i === 0 ? '14px' : '10px'} 0 ${i === rows.length - 1 ? '14px' : '10px'} 16px;font-family:${FONT};font-size:13px;line-height:20px;color:${C.muted};">${esc(k)}</td>
        <td valign="top" style="padding:${i === 0 ? '14px' : '10px'} 16px ${i === rows.length - 1 ? '14px' : '10px'} 0;font-family:${opts.mono ? MONO : FONT};font-size:14px;line-height:20px;font-weight:600;color:${C.text};font-variant-numeric:tabular-nums;word-break:break-word;">${esc(v)}</td>
      </tr>`,
    )
    .join('');
  return `<tr><td style="padding-top:22px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.sunken};border:1px solid ${C.border};border-radius:8px;">${body}</table>
  </td></tr>`;
}

/**
 * A credential or licence code, displayed once, large, monospace and
 * selectable. Grouped for readability but the raw value is in the text part.
 */
function codeBlock(label: string, value: string, tone: Tone = 'brand'): string {
  const t = TONE[tone];
  return `<tr><td style="padding-top:22px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${t.bg};border:1px solid ${t.bd};border-radius:8px;">
      <tr><td align="center" style="padding:20px 16px 18px;">
        <div style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${t.fg};padding-bottom:10px;">${esc(label)}</div>
        <div class="code" style="font-family:${MONO};font-size:28px;line-height:34px;font-weight:700;letter-spacing:0.16em;color:${C.text};font-variant-numeric:tabular-nums;word-break:break-all;">${esc(value)}</div>
      </td></tr>
    </table>
  </td></tr>`;
}

/** Tinted advisory panel. Title + body, never colour alone. */
function notice(title: string, bodyHtml: string, tone: Tone): string {
  const t = TONE[tone];
  return `<tr><td style="padding-top:22px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${t.bg};border:1px solid ${t.bd};border-radius:8px;">
      <tr><td style="padding:14px 16px;">
        <div style="font-family:${FONT};font-size:13px;font-weight:700;color:${t.fg};padding-bottom:4px;">${esc(title)}</div>
        <div style="font-family:${FONT};font-size:13px;line-height:20px;color:${C.body};">${bodyHtml}</div>
      </td></tr>
    </table>
  </td></tr>`;
}

/** Numbered next-steps list. */
function steps(items: string[]): string {
  const rows = items
    .map(
      (s, i) => `<tr>
        <td width="26" valign="top" style="width:26px;padding-top:${i === 0 ? 0 : 10}px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td align="center" valign="middle" width="20" height="20" style="width:20px;height:20px;background:${C.brand};border-radius:10px;color:#ffffff;font-family:${FONT};font-size:11px;font-weight:700;line-height:20px;text-align:center;">${i + 1}</td>
          </tr></table>
        </td>
        <td valign="top" style="padding-top:${i === 0 ? 0 : 10}px;font-family:${FONT};font-size:14px;line-height:20px;color:${C.body};">${s}</td>
      </tr>`,
    )
    .join('');
  return `<tr><td style="padding-top:20px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>
  </td></tr>`;
}

/** `${url}/logo.png` when an app URL is configured. */
function logoOf(url: string | null): string | null {
  return url ? `${url.replace(/\/+$/, '')}/logo.png` : null;
}

function signIn(url: string | null): string {
  return url ? `${url.replace(/\/+$/, '')}/login` : '#';
}

function textFooter(url: string | null): string {
  return (
    `\n\n—\nTradeFx — MT4 & MT5 Expert Advisor platform` +
    (url ? `\n${url}` : '') +
    `\nAutomated message — replies are not monitored.` +
    `\nTrading foreign exchange on margin carries a high level of risk and can result in the loss of more than your deposit.`
  );
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

/** New staff account, with first-use credentials. */
export function inviteEmail(p: { email: string; password: string; url: string | null }): RenderedEmail {
  const link = signIn(p.url);
  const html = shell(
    `Your TradeFx admin account is ready. Temporary password inside.`,
    `${header(logoOf(p.url))}
     ${pill('Account created', 'brand')}
     ${heading('Your admin account is ready', 'An administrator has created a TradeFx account for you. Use the temporary password below for your first sign-in.')}
     ${details([['Email', p.email], ['Temporary password', p.password]], { mono: false })}
     ${notice(
       'Change this password immediately',
       'This password was generated for you and has been sent by email, so treat it as compromised until you replace it. Change it as soon as you sign in, and never share it.',
       'warning',
     )}
     ${button('Sign in to TradeFx', link)}
     ${linkFallback(link)}
     ${footer(p.url)}`,
  );
  const text =
    `Your TradeFx admin account is ready\n\n` +
    `An administrator has created a TradeFx account for you.\n\n` +
    `Email: ${p.email}\nTemporary password: ${p.password}\n\n` +
    `Change this password immediately after signing in — it was sent by email, so treat it as compromised until you replace it.\n\n` +
    `Sign in: ${link}` +
    textFooter(p.url);
  return { subject: 'Your TradeFx admin account is ready', html, text };
}

/** An administrator reset this user's password. */
export function resetEmail(p: { email: string; password: string; url: string | null }): RenderedEmail {
  const link = signIn(p.url);
  const html = shell(
    `Your TradeFx password was reset by an administrator.`,
    `${header(logoOf(p.url))}
     ${pill('Password changed', 'warning')}
     ${heading('Your password has been reset', 'An administrator reset the password on your TradeFx account. Use the temporary password below to sign in.')}
     ${details([['Email', p.email], ['Temporary password', p.password]])}
     ${notice(
       'Did you not expect this?',
       'If you did not request a reset, contact your administrator straight away — someone else may have access to your account.',
       'error',
     )}
     ${button('Sign in to TradeFx', link)}
     ${linkFallback(link)}
     ${footer(p.url)}`,
  );
  const text =
    `Your TradeFx password has been reset\n\n` +
    `An administrator reset the password on your account.\n\n` +
    `Email: ${p.email}\nTemporary password: ${p.password}\n\n` +
    `Change it as soon as you sign in. If you did not expect this, contact your administrator straight away.\n\n` +
    `Sign in: ${link}` +
    textFooter(p.url);
  return { subject: 'Your TradeFx password has been reset', html, text };
}

/** Self-service reset: a one-time link. */
export function passwordResetLinkEmail(p: {
  email: string;
  url: string | null;
  resetUrl: string;
  expiresMinutes: number;
}): RenderedEmail {
  const html = shell(
    `Reset your TradeFx password. This link expires in ${p.expiresMinutes} minutes.`,
    `${header(logoOf(p.url))}
     ${pill('Password reset', 'brand')}
     ${heading('Reset your password', `We received a request to reset the password for <strong style="color:${C.text};">${esc(p.email)}</strong>. Choose a new one using the button below.`)}
     ${notice(
       `This link expires in ${p.expiresMinutes} minutes`,
       'It can be used once. If it expires, request a new one from the sign-in page.',
       'info',
     )}
     ${button('Choose a new password', p.resetUrl)}
     ${linkFallback(p.resetUrl)}
     ${paragraph(
       `<span style="color:${C.muted};">If you did not request this, you can ignore this email — your password will not change, and nobody can reset it without this link.</span>`,
       22,
     )}
     ${footer(p.url)}`,
  );
  const text =
    `Reset your TradeFx password\n\n` +
    `We received a request to reset the password for ${p.email}.\n\n` +
    `Open this link to choose a new password (valid for ${p.expiresMinutes} minutes, single use):\n${p.resetUrl}\n\n` +
    `If you did not request this, ignore this email — your password will not change.` +
    textFooter(p.url);
  return { subject: 'Reset your TradeFx password', html, text };
}

/** Welcome, after self-service registration. */
export function welcomeEmail(p: { name: string; url: string | null }): RenderedEmail {
  const link = p.url ? `${p.url.replace(/\/+$/, '')}/app` : '#';
  const products = p.url ? `${p.url.replace(/\/+$/, '')}/products` : '#';
  const html = shell(
    `Welcome to TradeFx — here is how to get your first Expert Advisor running.`,
    `${header(logoOf(p.url))}
     ${pill('Welcome', 'success')}
     ${heading(`Welcome to TradeFx, ${p.name}`, 'Your account is ready. Here is what happens next.')}
     ${steps([
       `Pick an Expert Advisor and <a href="${esc(products)}" style="color:${C.brandText};font-weight:600;">request a quotation</a>. We price per account, so an advisor replies with a figure.`,
       'Once your purchase is confirmed we issue a 9-character licence code.',
       'Enter that code with your MT4 or MT5 details, and the Expert Advisor starts trading.',
     ])}
     ${notice(
       'Your funds stay with your broker',
       'TradeFx never holds your money and cannot withdraw from your trading account. We place trades on it; you can stop or withdraw at any time.',
       'info',
     )}
     ${button('Open your dashboard', link)}
     ${footer(p.url)}`,
  );
  const text =
    `Welcome to TradeFx, ${p.name}\n\n` +
    `Your account is ready.\n\n` +
    `1. Pick an Expert Advisor and request a quotation — we price per account, so an advisor replies with a figure.\n` +
    `2. Once your purchase is confirmed we issue a 9-character licence code.\n` +
    `3. Enter that code with your MT4 or MT5 details, and the Expert Advisor starts trading.\n\n` +
    `Your funds stay with your broker. TradeFx never holds your money and cannot withdraw from your trading account.\n\n` +
    `Dashboard: ${link}` +
    textFooter(p.url);
  return { subject: 'Welcome to TradeFx', html, text };
}

/** A licence has been issued — this email carries the code. */
export function licenseIssuedEmail(p: {
  productName: string;
  code: string;
  url: string | null;
  expiresAt?: string | null;
}): RenderedEmail {
  const link = p.url ? `${p.url.replace(/\/+$/, '')}/app/bots` : '#';
  // Grouped for reading; the raw code is in the text part and the details row.
  const grouped = p.code.replace(/(.{3})(?=.)/g, '$1-');
  const html = shell(
    `Your ${p.productName} licence code is ready.`,
    `${header(logoOf(p.url))}
     ${pill('Licence issued', 'success')}
     ${heading(`Your ${p.productName} licence`, 'Your purchase is confirmed. Use the code below to connect a MetaTrader account.')}
     ${codeBlock('Licence code', grouped, 'success')}
     ${details([
       ['Expert Advisor', p.productName],
       ['Licence code', p.code],
       ['Valid until', p.expiresAt ?? 'No expiry'],
       ['Accounts', 'One trading account per licence'],
     ])}
     ${steps([
       'Open Trading Accounts in your dashboard.',
       'Enter this licence code with your MT4 or MT5 login and server.',
       'We verify the account and the Expert Advisor starts trading.',
     ])}
     ${notice(
       'Keep this code private',
       'Anyone with your licence code and your MetaTrader credentials could attach a bot to your account. Treat it like a password.',
       'warning',
     )}
     ${button('Connect your account', link)}
     ${linkFallback(link)}
     ${footer(p.url)}`,
  );
  const text =
    `Your ${p.productName} licence\n\n` +
    `Your purchase is confirmed.\n\n` +
    `Licence code: ${p.code}\n` +
    `Expert Advisor: ${p.productName}\n` +
    `Valid until: ${p.expiresAt ?? 'No expiry'}\n` +
    `One trading account per licence.\n\n` +
    `Next steps:\n` +
    `1. Open Trading Accounts in your dashboard.\n` +
    `2. Enter this licence code with your MT4 or MT5 login and server.\n` +
    `3. We verify the account and the Expert Advisor starts trading.\n\n` +
    `Keep this code private — treat it like a password.\n\n` +
    `Dashboard: ${link}` +
    textFooter(p.url);
  return { subject: `Your ${p.productName} licence code`, html, text };
}

/** Acknowledgement that a quotation request arrived. No price — by design. */
export function quoteReceivedEmail(p: {
  name: string;
  reference: string;
  subjectLine: string;
  url: string | null;
}): RenderedEmail {
  const link = p.url ? `${p.url.replace(/\/+$/, '')}/app/quotes` : '#';
  const html = shell(
    `We have your request — reference ${p.reference}.`,
    `${header(logoOf(p.url))}
     ${pill('Request received', 'info')}
     ${heading('We have your request', `Thanks ${esc(p.name)} — an advisor will review it and send you a price, normally within one business day.`)}
     ${details([
       ['Reference', p.reference],
       ['Enquiry about', p.subjectLine],
       ['Status', 'Awaiting review'],
     ])}
     ${notice(
       'No payment has been taken',
       'This is a quotation request, not an order. Nothing is charged and nothing starts trading until you confirm a price with us.',
       'info',
     )}
     ${paragraph(
       `Quote your reference <strong style="color:${C.text};font-family:${MONO};">${esc(p.reference)}</strong> if you get in touch about this request.`,
     )}
     ${button('Track this request', link)}
     ${footer(p.url)}`,
  );
  const text =
    `We have your request\n\n` +
    `Thanks ${p.name} — an advisor will review it and send you a price, normally within one business day.\n\n` +
    `Reference: ${p.reference}\nEnquiry about: ${p.subjectLine}\nStatus: Awaiting review\n\n` +
    `No payment has been taken. This is a quotation request, not an order — nothing is charged and nothing starts trading until you confirm a price with us.\n\n` +
    `Track it: ${link}` +
    textFooter(p.url);
  return { subject: `We have your request — ${p.reference}`, html, text };
}

/**
 * An advisor has replied to a quotation.
 *
 * The figure itself is written by the advisor into `note` — the platform holds
 * no price field, so nothing here can render a number the advisor did not
 * intend to send.
 */
export function quoteAnsweredEmail(p: {
  name: string;
  reference: string;
  subjectLine: string;
  note: string;
  url: string | null;
}): RenderedEmail {
  const link = p.url ? `${p.url.replace(/\/+$/, '')}/app/quotes` : '#';
  const noteHtml = esc(p.note).replace(/\n/g, '<br />');
  const html = shell(
    `Your TradeFx quotation is ready — reference ${p.reference}.`,
    `${header(logoOf(p.url))}
     ${pill('Quotation ready', 'success')}
     ${heading('Your quotation', `Hello ${esc(p.name)} — here is our reply to your request.`)}
     ${details([
       ['Reference', p.reference],
       ['Enquiry about', p.subjectLine],
     ])}
     ${notice('From your advisor', noteHtml, 'brand')}
     ${paragraph(
       `Reply to this quotation by contacting us directly, or open your dashboard to see it alongside your other requests.`,
     )}
     ${button('View in your dashboard', link)}
     ${footer(p.url)}`,
  );
  const text =
    `Your TradeFx quotation\n\n` +
    `Hello ${p.name} — here is our reply to your request.\n\n` +
    `Reference: ${p.reference}\nEnquiry about: ${p.subjectLine}\n\n` +
    `From your advisor:\n${p.note}\n\n` +
    `Dashboard: ${link}` +
    textFooter(p.url);
  return { subject: `Your TradeFx quotation — ${p.reference}`, html, text };
}

/**
 * Internal alert: a trade the Expert Advisor placed on the master did not
 * reach a client account. Staff-facing, so it names accounts directly.
 */
export function executionAlertEmail(p: {
  order: string;
  master: string;
  slave: string;
  url: string | null;
}): RenderedEmail {
  const link = p.url ? `${p.url.replace(/\/+$/, '')}/dashboard/monitor` : '#';
  const html = shell(
    `A trade did not execute on ${p.slave}.`,
    `${header(logoOf(p.url))}
     ${pill('Execution failed', 'error')}
     ${heading('A trade did not execute', 'A trade from the Expert Advisor master could not be placed on a client account. The client account is now out of step with the master.')}
     ${details([
       ['Order', p.order],
       ['Master account', p.master],
       ['Client account', p.slave],
       ['Detected at', new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC'],
     ])}
     ${notice(
       'What to check',
       'Margin and free equity on the client account, whether the symbol exists on that broker, the account\'s connection status, and any trading-hours window that may be blocking new positions.',
       'warning',
     )}
     ${button('Open Live Monitor', link)}
     ${footer(p.url, 'Repeat failures for the same account and symbol are suppressed for five minutes.')}`,
  );
  const text =
    `A trade did not execute\n\n` +
    `A trade from the Expert Advisor master could not be placed on a client account.\n\n` +
    `Order: ${p.order}\nMaster account: ${p.master}\nClient account: ${p.slave}\n` +
    `Detected at: ${new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC\n\n` +
    `What to check: margin and free equity on the client account, whether the symbol exists on that broker, the account's connection status, and any trading-hours window blocking new positions.\n\n` +
    `Live Monitor: ${link}` +
    textFooter(p.url);
  return { subject: `Trade execution failed — ${p.order}`, html, text };
}

/**
 * Internal alert: a customer asked for a quotation.
 *
 * Every sale starts here, so this goes to staff the moment the form is
 * submitted rather than waiting for someone to open the dashboard. It carries
 * the enquiry itself so an advisor can judge urgency without signing in — but
 * never a price, because the platform holds none.
 */
export function newQuoteAlertEmail(p: {
  reference: string;
  subjectLine: string;
  name: string;
  email: string;
  phone: string | null;
  broker: string | null;
  accountSize: string | null;
  message: string;
  registered: boolean;
  url: string | null;
}): RenderedEmail {
  const link = p.url ? `${p.url.replace(/\/+$/, '')}/dashboard/quotes` : '#';
  const messageHtml = esc(p.message).replace(/\n/g, '<br />');
  const rows: [string, string][] = [
    ['Reference', p.reference],
    ['Enquiry about', p.subjectLine],
    ['Name', p.name],
    ['Email', p.email],
  ];
  if (p.phone) rows.push(['Phone', p.phone]);
  if (p.broker) rows.push(['Broker', p.broker]);
  if (p.accountSize) rows.push(['Account size', p.accountSize]);
  rows.push(['Account', p.registered ? 'Registered customer' : 'No account yet']);

  const html = shell(
    `${p.name} asked for a quotation — ${p.reference}.`,
    `${header(logoOf(p.url))}
     ${pill('New enquiry', 'info')}
     ${heading('Someone asked for a quotation', 'They have been sent an acknowledgement and are waiting on a price from you.')}
     ${details(rows)}
     ${notice('What they wrote', messageHtml, 'brand')}
     ${button('Open the quote', link)}
     ${footer(p.url)}`,
  );
  const text =
    `Someone asked for a quotation\n\n` +
    `They have been sent an acknowledgement and are waiting on a price from you.\n\n` +
    rows.map(([k, v]) => `${k}: ${v}`).join('\n') +
    `\n\nWhat they wrote:\n${p.message}\n\n` +
    `Open the quote: ${link}` +
    textFooter(p.url);
  return { subject: `New quotation request — ${p.reference} (${p.subjectLine})`, html, text };
}
