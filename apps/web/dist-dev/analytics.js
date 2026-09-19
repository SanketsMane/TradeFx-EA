/*
 * Google Analytics 4 bootstrap.
 *
 * Self-hosted rather than inline: the site's CSP sets `script-src 'self'`
 * with no `unsafe-inline`, so an inline gtag block would be silently blocked
 * and analytics would record nothing. Keeping it in a file means the CSP only
 * has to allow googletagmanager.com for the loader.
 *
 * Guarded by hostname so local development and preview builds do not report
 * into the production property.
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
  // send_page_view is off here because this is a single-page app: the router
  // reports each view itself, otherwise only the first load is ever counted.
  gtag('config', MEASUREMENT_ID, { send_page_view: false });

  // The first view still has to be sent, since we disabled the automatic one.
  gtag('event', 'page_view', {
    page_path: window.location.pathname + window.location.search,
    page_location: window.location.href,
    page_title: document.title,
  });
})();
