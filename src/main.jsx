import React from 'react';
import ReactDOM from 'react-dom/client';
import { initThemeEarly } from '@/store/themeStore';
import App from './app/App';
import Providers from './app/providers';
import './index.css';

// ── Apply persisted theme synchronously BEFORE first render ──────────────
// This eliminates any flash-of-wrong-theme on page load / refresh.
initThemeEarly();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
);
