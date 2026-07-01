import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import AppRoutes from '@/routes/AppRoutes';
import CartToastPortal from '@/components/CartToastPortal';

/**
 * App.jsx — root component
 *
 * CartToastPortal is mounted here — above the router, outside any
 * page or feature component. It uses ReactDOM.createPortal to render
 * directly into document.body, completely immune to any CSS stacking
 * context, overflow:hidden, or transform on any ancestor element.
 *
 * One portal, one toast, works from every page automatically.
 */
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        {/* Single global toast portal — renders into document.body */}
        <CartToastPortal />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
