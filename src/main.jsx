import React from 'react';
import ReactDOM from 'react-dom/client';
import { initThemeEarly } from '@/store/themeStore';
import App from './app/App';
import './index.css';
import './styles/mobile.css';
import { registerServiceWorker } from './utils/registerSW';

// ── Apply persisted theme synchronously BEFORE first render ──────────────
// This eliminates any flash-of-wrong-theme on page load / refresh.
initThemeEarly();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ── Register Service Worker after React has mounted ───────────────────────
// registerServiceWorker() internally uses requestIdleCallback so it never
// runs on the critical path — React renders first, SW registers later.
registerServiceWorker();
