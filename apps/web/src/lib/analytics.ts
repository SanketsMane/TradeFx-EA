/**
 * Analytics events.
 *
 * GA4's enhanced measurement only reports page views, scrolls, form
 * interactions and clicks on links to *other* domains. It reports nothing
 * about the things that matter commercially here — which quote CTA was
 * pressed, from which page, for which product — so those are sent explicitly.
 *
 * `window.gtag` is defined synchronously by /analytics.js and pushes to
 * dataLayer, so events raised before gtag.js finishes loading are queued and
 * delivered when it arrives. Nothing here needs to wait for it.
 */
type Params = Record<string, string | number | boolean | undefined>;

/** Safe no-op when analytics is absent: local dev, or a visitor blocking it. */
export function track(event: string, params: Params = {}): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  const clean: Params = {};
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== '') clean[k] = v;
  window.gtag('event', event, clean);
}

/**
 * A quotation request was submitted successfully. GA4's recommended event for
 * this, so it can be marked as a conversion without custom configuration.
 */
export function trackLead(subject: { productSlug?: string; serviceSlug?: string }): void {
  track('generate_lead', {
    item_id: subject.productSlug ?? subject.serviceSlug,
    item_category: subject.productSlug ? 'expert_advisor' : 'service',
  });
}

export function trackSignUp(method: 'email' | 'phone'): void {
  track('sign_up', { method });
}

export function trackLogin(method: 'email' | 'phone'): void {
  track('login', { method });
}
