/**
 * App.jsx — Root component
 *
 * Wraps AppRoutes in <Providers> which supplies:
 *   BrowserRouter, ThemeProvider, AuthProvider, CartProvider, ToastProvider
 *
 * Previously this file rendered <AppRoutes /> directly, meaning there was
 * no BrowserRouter in the tree → useSearchParams / useNavigate inside
 * AppRoutes (and every page it renders) would throw at runtime.
 *
 * router.jsx is now dead code — do not import it.
 */
import Providers from "./providers";
import AppRoutes from "@/routes/AppRoutes";

const App = () => (
  <Providers>
    <AppRoutes />
  </Providers>
);

export default App;
