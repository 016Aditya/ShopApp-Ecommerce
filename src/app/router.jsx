/**
 * router.jsx — DEPRECATED / DEAD CODE
 *
 * This file is no longer used. It was the original application entry point
 * before App.jsx was introduced. It contained its own <BrowserRouter> which
 * would have created a double-router if accidentally imported alongside the
 * BrowserRouter inside providers.jsx.
 *
 * The correct tree is:
 *
 *   main.jsx
 *   └─ <App />           (app/App.jsx)
 *      └─ <Providers>     (app/providers.jsx — owns the single BrowserRouter)
 *         └─ <AppRoutes>  (routes/AppRoutes.jsx)
 *
 * Do NOT import this file. It is kept only for reference and will be removed
 * in a future cleanup.
 */

// Safe re-export in case something still imports from here — points to the
// correct providers + routes setup so the app does not break.
import Providers from "./providers";
import AppRoutes from "@/routes/AppRoutes";

function AppRouter() {
  return (
    <Providers>
      <AppRoutes />
    </Providers>
  );
}

export default AppRouter;
