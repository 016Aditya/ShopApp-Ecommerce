/**
 * registerSW.js — Stage 1: Service Worker registration.
 *
 * Called from main.jsx via requestIdleCallback so the SW registration
 * never runs on the critical rendering path before first paint.
 *
 * Only runs in production (import.meta.env.PROD) to avoid polluting
 * the development experience with a stale cache.
 */
export function registerServiceWorker() {
  if (!import.meta.env.PROD) return;
  if (!('serviceWorker' in navigator)) return;

  const register = () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        // Check for updates in the background every 60 minutes
        setInterval(() => registration.update(), 60 * 60 * 1000);
      })
      .catch((err) => {
        // Non-fatal — app works fine without a service worker
        console.warn('[SW] Registration failed:', err);
      });
  };

  // Defer registration until after the page is interactive
  if ('requestIdleCallback' in window) {
    requestIdleCallback(register, { timeout: 3000 });
  } else {
    window.addEventListener('load', register);
  }
}
