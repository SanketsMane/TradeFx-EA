import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('root') as HTMLElement;

/*
 * Hydrate when the build has prerendered this route, otherwise mount fresh.
 *
 * `createRoot` on a prerendered page throws the existing DOM away and rebuilds
 * it. That showed up as a repaint of the largest element at 5.6s — long after
 * it had already painted at 1s — and as a single 0.17 layout shift when the
 * old tree was discarded. Hydration attaches to what is already there, so the
 * paint the visitor sees first is the paint that counts.
 */
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
