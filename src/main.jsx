import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { initThemeEarly } from '@/store/themeStore';
import { queryClient } from '@/lib/queryClient';
import App from './app/App';
import './index.css';
import './styles/mobile.css';
import { registerServiceWorker } from './utils/registerSW';

// ── Apply persisted theme synchronously BEFORE first render ──────────────────
// This eliminates any flash-of-wrong-theme on page load / refresh.
initThemeEarly();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/*
      QueryClientProvider wraps the entire app so every component can
      call useQuery / useMutation without additional setup.
      The queryClient instance is created in src/lib/queryClient.js.
    */}
    <QueryClientProvider client={queryClient}>
      <App />

      {/*
        React Query DevTools are only loaded in development builds.
        import.meta.env.DEV is stripped to `false` by Vite at build time,
        so the DevTools package is NEVER included in the production bundle.
      */}
      {import.meta.env.DEV && (
        <DevToolsLoader />
      )}
    </QueryClientProvider>
  </React.StrictMode>
);

/**
 * DevToolsLoader
 *
 * Lazily loads ReactQueryDevtools only in development.
 * Using a separate component with React.lazy ensures the devtools chunk
 * is never evaluated in production, even if tree-shaking is imperfect.
 */
function DevToolsLoader() {
  const LazyDevtools = React.lazy(() =>
    import('@tanstack/react-query-devtools').then((m) => ({
      default: m.ReactQueryDevtools,
    }))
  );
  return (
    <React.Suspense fallback={null}>
      <LazyDevtools initialIsOpen={false} buttonPosition="bottom-right" />
    </React.Suspense>
  );
}

// ── Register Service Worker after React has mounted ───────────────────────────
// registerServiceWorker() internally uses requestIdleCallback so it never
// runs on the critical path — React renders first, SW registers later.
registerServiceWorker();
