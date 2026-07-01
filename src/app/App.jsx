import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '@/routes/AppRoutes';
import CartToastPortal from '@/components/CartToastPortal';

/**
 * App.jsx — root component
 *
 * Auth state is managed by Zustand (src/store/authStore.js) — there is
 * no React Context Provider for auth in this project. Components read
 * auth state directly via useAuthStore() or the useAuth() hook wrapper.
 *
 * CartToastPortal is mounted once here, above all routes. It uses
 * ReactDOM.createPortal to render into document.body, so the toast is
 * immune to any ancestor CSS stacking context or overflow:hidden.
 */
const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
      {/* Single global cart toast — renders into document.body via portal */}
      <CartToastPortal />
    </BrowserRouter>
  );
};

export default App;
