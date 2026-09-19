/*
 * Google Analytics 4 bootstrap.
 *
 * gtag.js is ~512 kB of JavaScript — larger than this entire application —
 * so it is not allowed to compete with the page for the main thread. It is
 * injected once the page has loaded and the browser is idle, which keeps it
 * off the largest-contentful-paint path entirely. Page views are still
 * recorded; they are just recorded a moment later.
 *
 * Self-hosted rather than inline because the site's CSP sets
 * `script-src 'self'` with no `unsafe-inline`: Google's inline snippet would
 * be blocked outright and record nothing.
 *
 * Guarded by hostname so local development never reports to the property.
 */
(function () {
  var MEASUREMENT_ID = 'G-0JWB9R1688';
  var HOSTS = ['tradefx.in', 'www.tradefx.in'];
  if (HOSTS.indexOf(window.location.hostname) === -1) return;

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  // send_page_view is off because this is a single-page app: the router
  // reports each view, otherwise only the first load would ever be counted.
  gtag('config', MEASUREMENT_ID, { send_page_view: false });

  // Queued now, sent as soon as gtag.js finishes loading.
  gtag('event', 'page_view', {
    page_path: window.location.pathname + window.location.search,
    page_location: window.location.href,
    page_title: document.title,
  });

  function load() {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
    document.head.appendChild(s);
  }

  function schedule() {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(load, { timeout: 4000 });
    } else {
      setTimeout(load, 2000);
    }
  }

  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });
})();
