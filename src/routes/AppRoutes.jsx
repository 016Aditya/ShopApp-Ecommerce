import { lazy, Suspense } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import PATHS from "./paths";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

// Layouts — always in the critical bundle (renders on every page)
import PageWrapper from "@/components/layout/PageWrapper";
import PageLoader from "@/components/skeleton/PageLoader";

// ─── Eagerly loaded ──────────────────────────────────────────────────
// HomePage is the most-visited page and must be in the critical bundle.
import HomePage from "@/features/home/pages/HomePage";

// ─── Lazily loaded ──────────────────────────────────────────────────
// Everything else is split into async chunks.

// Auth
const Login          = lazy(() => import("@/features/auth/pages/Login"));
const Register       = lazy(() => import("@/features/auth/pages/Register"));
const OAuth2Success  = lazy(() => import("@/features/auth/pages/OAuth2Success"));
const ForgotPassword = lazy(() => import("@/features/auth/pages/ForgotPassword"));
const ResetPassword  = lazy(() => import("@/features/auth/pages/ResetPassword"));

// Public product pages
const ProductsPage        = lazy(() => import("@/features/products/pages/ProductsPage"));
const ProductDetailPage   = lazy(() => import("@/features/products/pages/ProductDetailPage"));
const CustomerServicePage = lazy(() => import("@/features/customerService/pages/CustomerServicePage"));
const WishlistPage        = lazy(() => import("@/features/wishlist/pages/WishlistPage"));

// Protected pages
const CartPage           = lazy(() => import("@/features/cart/pages/CartPage"));
const CheckoutPage       = lazy(() => import("@/features/orders/pages/CheckoutPage"));
const OrdersPage         = lazy(() => import("@/features/orders/pages/OrdersPage"));
const OrderDetailPage    = lazy(() => import("@/features/orders/pages/OrderDetailPage"));
const OrderSuccessPage   = lazy(() => import("@/features/orders/pages/OrderSuccessPage"));
const ProfilePage        = lazy(() => import("@/features/profile/pages/ProfilePage"));
const SavedAddressesPage = lazy(() => import("@/features/profile/pages/SavedAddressesPage"));

// Errors
const NotFound = lazy(() => import("@/errors/NotFound"));

/**
 * ProductDetailRoute
 *
 * Thin wrapper that reads the :id param and passes it as `key` to
 * ProductDetailPage. React uses `key` as a component identity signal:
 * when the key changes, the old instance is unmounted and a fresh one
 * is mounted. This guarantees:
 *
 *  1. The correct TanStack Query fires immediately for the new product ID.
 *  2. No stale product data from Product A is ever shown while Product B
 *     is loading.
 *  3. All local useState (toast, addingToCart, etc.) resets cleanly.
 *  4. Browser Back/Forward shows the correct product because each history
 *     entry maps to a distinct component instance.
 *
 * The Suspense boundary stays OUTSIDE so React does not need to
 * re-download the chunk on every navigation — only the component
 * instance is replaced, not the lazy module.
 */
const ProductDetailRoute = () => {
  const { id } = useParams();
  return <ProductDetailPage key={id} />;
};

const AppRoutes = () => (
  <Routes>
    {/* OAuth2 callback — no layout wrapper */}
    <Route
      path={PATHS.OAUTH2_SUCCESS}
      element={
        <Suspense fallback={null}>
          <OAuth2Success />
        </Suspense>
      }
    />

    {/* All other routes share the PageWrapper (Navbar + Footer) */}
    <Route element={<PageWrapper />}>
      <Route
        element={
          <Suspense fallback={<PageLoader />}>
            <Routes />
          </Suspense>
        }
      />

      {/* Public-only routes (blocked when already logged in) */}
      <Route element={<PublicRoute />}>
        <Route path={PATHS.LOGIN}           element={<Suspense fallback={<PageLoader />}><Login /></Suspense>} />
        <Route path={PATHS.REGISTER}        element={<Suspense fallback={<PageLoader />}><Register /></Suspense>} />
        <Route path={PATHS.FORGOT_PASSWORD} element={<Suspense fallback={<PageLoader />}><ForgotPassword /></Suspense>} />
        <Route path={PATHS.RESET_PASSWORD}  element={<Suspense fallback={<PageLoader />}><ResetPassword /></Suspense>} />
      </Route>

      {/* Open routes */}
      <Route path={PATHS.HOME}             element={<HomePage />} />
      <Route path={PATHS.PRODUCTS}         element={<Suspense fallback={<PageLoader />}><ProductsPage /></Suspense>} />
      <Route
        path={PATHS.PRODUCT_DETAIL}
        element={
          <Suspense fallback={<PageLoader />}>
            <ProductDetailRoute />
          </Suspense>
        }
      />
      <Route path={PATHS.CUSTOMER_SERVICE} element={<Suspense fallback={<PageLoader />}><CustomerServicePage /></Suspense>} />
      <Route path={PATHS.WISHLIST}         element={<Suspense fallback={<PageLoader />}><WishlistPage /></Suspense>} />

      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        <Route path={PATHS.CART}            element={<Suspense fallback={<PageLoader />}><CartPage /></Suspense>} />
        <Route path={PATHS.CHECKOUT}        element={<Suspense fallback={<PageLoader />}><CheckoutPage /></Suspense>} />
        <Route path={PATHS.ORDERS}          element={<Suspense fallback={<PageLoader />}><OrdersPage /></Suspense>} />
        <Route path={PATHS.ORDER_DETAIL}    element={<Suspense fallback={<PageLoader />}><OrderDetailPage /></Suspense>} />
        <Route path={PATHS.ORDER_SUCCESS}   element={<Suspense fallback={<PageLoader />}><OrderSuccessPage /></Suspense>} />
        <Route path={PATHS.PROFILE}         element={<Suspense fallback={<PageLoader />}><ProfilePage /></Suspense>} />
        <Route path={PATHS.SAVED_ADDRESSES} element={<Suspense fallback={<PageLoader />}><SavedAddressesPage /></Suspense>} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFound /></Suspense>} />
    </Route>
  </Routes>
);

export default AppRoutes;
