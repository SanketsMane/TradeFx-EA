import {
  executionAlertEmail,
  inviteEmail,
  licenseIssuedEmail,
  newQuoteAlertEmail,
  passwordResetLinkEmail,
  quoteAnsweredEmail,
  quoteReceivedEmail,
  resetEmail,
  welcomeEmail,
  type RenderedEmail,
} from './templates';

const url = 'https://tradefx.in';

const ALL: [string, RenderedEmail][] = [
  ['invite', inviteEmail({ email: 'new@admin.com', password: 'Temp#1234', url })],
  ['reset', resetEmail({ email: 'a@b.com', password: 'New#5678', url })],
  [
    'resetLink',
    passwordResetLinkEmail({ email: 'a@b.com', url, resetUrl: `${url}/reset-password?token=t`, expiresMinutes: 30 }),
  ],
  ['welcome', welcomeEmail({ name: 'Asha Patel', url })],
  ['licence', licenseIssuedEmail({ productName: 'TradeFx Scalper', code: 'K7M4XQ2R9', url })],
  [
    'quoteReceived',
    quoteReceivedEmail({ name: 'Asha', reference: 'TFX-4821', subjectLine: 'TradeFx Heddge', url }),
  ],
  [
    'quoteAnswered',
    quoteAnsweredEmail({
      name: 'Asha',
      reference: 'TFX-4821',
      subjectLine: 'TradeFx Heddge',
      note: 'Quoted by email today.',
      url,
    }),
  ],
  [
    'newQuoteAlert',
    newQuoteAlertEmail({
      reference: 'TFX-4821',
      subjectLine: 'TradeFx Heddge',
      name: 'Asha Patel',
      email: 'asha@example.com',
      phone: '+919812345678',
      broker: 'Exness',
      accountSize: '1000-5000',
      message: 'How much for the Heddge EA?',
      registered: true,
      url,
    }),
  ],
  [
    'executionAlert',
    executionAlertEmail({ order: 'BUY 0.50 XAUUSD (OPEN)', master: 'Master (#1)', slave: 'Client (#2)', url }),
  ],
];

describe('email templates', () => {
  describe.each(ALL)('%s', (_name, mail) => {
    it('has a subject, html and text part', () => {
      expect(mail.subject.length).toBeGreaterThan(5);
      expect(mail.html).toContain('<!DOCTYPE');
      expect(mail.text.trim().length).toBeGreaterThan(40);
    });

    it('leaks no unrendered template syntax', () => {
      for (const part of [mail.subject, mail.html, mail.text]) {
        expect(part).not.toContain('${');
        expect(part).not.toContain('undefined');
        expect(part).not.toContain('[object Object]');
        expect(part).not.toContain('NaN');
      }
    });

    it('carries a preheader so the inbox preview is not the logo alt text', () => {
      expect(mail.html).toMatch(/mso-hide:all/);
    });

    it('declares a light colour scheme, since clients invert dark mode crudely', () => {
      expect(mail.html).toContain('name="color-scheme" content="light only"');
    });

    it('never says copy trading — these are Expert Advisors', () => {
      const visible = mail.html.replace(/<[^>]+>/g, ' ');
      for (const part of [mail.subject, visible, mail.text]) {
        expect(part).not.toMatch(/\bcopy trading\b/i);
        expect(part).not.toMatch(/\btrade copier\b/i);
      }
    });

    it('uses no emoji, which render inconsistently across clients', () => {
      // Pictographs and dingbat-emoji ranges; plain punctuation is fine.
      expect(mail.html).not.toMatch(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u);
    });

    it('carries the risk disclosure required on financial mail', () => {
      expect(mail.text).toMatch(/high level of risk/i);
    });
  });

  describe('content', () => {
    it('invite shows the credentials and tells the user to replace them', () => {
      const r = inviteEmail({ email: 'new@admin.com', password: 'Temp#1234', url });
      expect(r.html).toContain('new@admin.com');
      expect(r.html).toContain('Temp#1234');
      expect(r.html).toContain(`${url}/login`);
      expect(r.html).toMatch(/change this password immediately/i);
      expect(r.text).toContain('Temp#1234');
    });

    it('reset link states the expiry and single use, in both parts', () => {
      const r = passwordResetLinkEmail({
        email: 'a@b.com',
        url,
        resetUrl: `${url}/reset-password?token=abc`,
        expiresMinutes: 30,
      });
      expect(r.html).toMatch(/expires in 30 minutes/i);
      expect(r.html).toContain(`${url}/reset-password?token=abc`);
      expect(r.text).toMatch(/single use/i);
    });

    it('licence email shows the code grouped for reading and raw for typing', () => {
      const r = licenseIssuedEmail({ productName: 'TradeFx Scalper', code: 'K7M4XQ2R9', url });
      expect(r.html).toContain('K7M-4XQ-2R9'); // grouped, for reading
      expect(r.html).toContain('K7M4XQ2R9'); // raw, for the form
      expect(r.text).toContain('K7M4XQ2R9');
      expect(r.subject).toContain('TradeFx Scalper');
      expect(r.html).toMatch(/keep this code private/i);
    });

    it('licence email says "No expiry" rather than leaving it blank', () => {
      const r = licenseIssuedEmail({ productName: 'X', code: 'ABCDEFGHJ', url, expiresAt: null });
      expect(r.html).toContain('No expiry');
      expect(r.text).toContain('No expiry');
    });

    it('quote acknowledgement carries the reference and promises no price', () => {
      const r = quoteReceivedEmail({ name: 'Asha', reference: 'TFX-4821', subjectLine: 'Heddge', url });
      expect(r.subject).toContain('TFX-4821');
      expect(r.html).toContain('TFX-4821');
      expect(r.html).toMatch(/no payment has been taken/i);
    });

    it('quote reply renders the advisor note and keeps its line breaks', () => {
      const r = quoteAnsweredEmail({
        name: 'Asha',
        reference: 'TFX-1',
        subjectLine: 'Scalper',
        note: 'Line one.\nLine two.',
        url,
      });
      expect(r.html).toContain('Line one.<br />Line two.');
      expect(r.text).toContain('Line one.\nLine two.');
    });

    it('new-quote alert carries the enquiry so staff can triage from the inbox', () => {
      const r = newQuoteAlertEmail({
        reference: 'TFX-4821',
        subjectLine: 'TradeFx Heddge',
        name: 'Asha Patel',
        email: 'asha@example.com',
        phone: '+919812345678',
        broker: 'Exness',
        accountSize: '1000-5000',
        message: 'How much for the Heddge EA?',
        registered: false,
        url,
      });
      expect(r.subject).toContain('TFX-4821');
      expect(r.subject).toContain('TradeFx Heddge');
      expect(r.html).toContain('asha@example.com');
      expect(r.html).toContain('+919812345678');
      expect(r.html).toContain('How much for the Heddge EA?');
      expect(r.html).toContain('No account yet');
      expect(r.html).toContain(`${url}/dashboard/quotes`);
    });

    it('new-quote alert omits fields the customer left blank rather than printing null', () => {
      const r = newQuoteAlertEmail({
        reference: 'TFX-1',
        subjectLine: 'TradeFx Scalper',
        name: 'Asha',
        email: 'asha@example.com',
        phone: null,
        broker: null,
        accountSize: null,
        message: 'Please quote.',
        registered: true,
        url,
      });
      expect(r.html).not.toContain('null');
      expect(r.text).not.toContain('null');
      expect(r.html).not.toContain('Phone');
      expect(r.html).toContain('Registered customer');
    });

    it('execution alert names both accounts and what to check', () => {
      const r = executionAlertEmail({
        order: 'BUY 0.50 XAUUSD (OPEN)',
        master: 'Master (#1)',
        slave: 'Client (#2)',
        url,
      });
      expect(r.subject).toMatch(/execution failed/i);
      expect(r.html).toContain('BUY 0.50 XAUUSD (OPEN)');
      expect(r.html).toContain('Client (#2)');
      expect(r.html).toMatch(/margin and free equity/i);
    });
  });

  describe('safety', () => {
    it('escapes HTML in user-supplied values', () => {
      const r = quoteAnsweredEmail({
        name: '<script>alert(1)</script>',
        reference: 'TFX-1',
        subjectLine: '"><img src=x onerror=alert(1)>',
        note: '<b>bold</b>',
        url,
      });
      // The payload must survive as inert text, never as a live element.
      expect(r.html).not.toMatch(/<script/i);
      expect(r.html).not.toMatch(/<img[^>]*onerror/i);
      expect(r.html).toContain('&lt;script&gt;');
      expect(r.html).toContain('&lt;b&gt;bold&lt;/b&gt;');
      expect(r.html).toContain('&lt;img src=x onerror=alert(1)&gt;');
    });

    it('escapes HTML in a quotation enquiry, which is attacker-controlled', () => {
      const r = newQuoteAlertEmail({
        reference: 'TFX-1',
        subjectLine: 'TradeFx Scalper',
        name: '<script>alert(1)</script>',
        email: 'a@b.com',
        phone: null,
        broker: '"><img src=x onerror=alert(1)>',
        accountSize: null,
        message: '<b>quote me</b>',
        registered: false,
        url,
      });
      expect(r.html).not.toMatch(/<script/i);
      expect(r.html).not.toMatch(/<img[^>]*onerror/i);
      expect(r.html).toContain('&lt;script&gt;');
      expect(r.html).toContain('&lt;b&gt;quote me&lt;/b&gt;');
    });

    it('renders without an app URL, falling back to the monogram', () => {
      const r = welcomeEmail({ name: 'Asha', url: null });
      expect(r.html).not.toContain('undefined');
      expect(r.html).not.toContain('<img'); // no logo to load
      expect(r.html).toContain('>T<'); // monogram tile instead
    });

    it('does not put a password in the subject line', () => {
      expect(inviteEmail({ email: 'a@b.com', password: 'Temp#1234', url }).subject).not.toContain(
        'Temp#1234',
      );
      expect(resetEmail({ email: 'a@b.com', password: 'Temp#1234', url }).subject).not.toContain(
        'Temp#1234',
      );
    });
  });
});
