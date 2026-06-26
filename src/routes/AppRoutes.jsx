import { lazy, Suspense } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import PATHS from "./paths";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

// Layouts — always in the critical bundle (renders on every page)
import PageWrapper from "@/components/layout/PageWrapper";
import PageLoader from "@/components/skeleton/PageLoader";

// ─── Eagerly loaded ──────────────────────────────────────────────────
import HomePage from "@/features/home/pages/HomePage";

// ─── Lazily loaded ──────────────────────────────────────────────────
const Login          = lazy(() => import("@/features/auth/pages/Login"));
const Register       = lazy(() => import("@/features/auth/pages/Register"));
const OAuth2Success  = lazy(() => import("@/features/auth/pages/OAuth2Success"));
const ForgotPassword = lazy(() => import("@/features/auth/pages/ForgotPassword"));
const ResetPassword  = lazy(() => import("@/features/auth/pages/ResetPassword"));

const ProductsPage        = lazy(() => import("@/features/products/pages/ProductsPage"));
const ProductDetailPage   = lazy(() => import("@/features/products/pages/ProductDetailPage"));
const CustomerServicePage = lazy(() => import("@/features/customerService/pages/CustomerServicePage"));
const WishlistPage        = lazy(() => import("@/features/wishlist/pages/WishlistPage"));

const CartPage           = lazy(() => import("@/features/cart/pages/CartPage"));
const CheckoutPage       = lazy(() => import("@/features/orders/pages/CheckoutPage"));
const OrdersPage         = lazy(() => import("@/features/orders/pages/OrdersPage"));
const OrderDetailPage    = lazy(() => import("@/features/orders/pages/OrderDetailPage"));
const OrderSuccessPage   = lazy(() => import("@/features/orders/pages/OrderSuccessPage"));
const ProfilePage        = lazy(() => import("@/features/profile/pages/ProfilePage"));
const SavedAddressesPage = lazy(() => import("@/features/profile/pages/SavedAddressesPage"));

const NotFound = lazy(() => import("@/errors/NotFound"));

/**
 * ProductDetailRoute
 *
 * Reads :id and passes it as the React `key` to ProductDetailPage.
 * When the key changes React unmounts the old instance and mounts a
 * fresh one — guaranteeing the correct TanStack Query fires for every
 * new product ID and no stale data from a previous product is shown.
 *
 * The Suspense boundary lives OUTSIDE so the lazy chunk is not
 * re-downloaded on every navigation; only the component instance
 * is replaced.
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

    {/* All other routes share PageWrapper (Navbar + Footer via Outlet) */}
    <Route element={<PageWrapper />}>

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
