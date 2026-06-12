import { Routes, Route } from "react-router-dom";
import PATHS from "./paths";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

// Layouts
import PageWrapper from "@/components/layout/PageWrapper";

// Auth pages
import Login from "@/features/auth/pages/Login";
import Register from "@/features/auth/pages/Register";
import OAuth2Success from "@/features/auth/pages/OAuth2Success";

// Home page (banners + featured products + categories)
import Home from "@/features/products/pages/Home";

// Product pages (public)
import ProductsPage from "@/features/products/pages/ProductsPage";
import ProductDetailPage from "@/features/products/pages/ProductDetailPage";

// Protected pages
import CartPage from "@/features/cart/pages/CartPage";
import CheckoutPage from "@/features/orders/pages/CheckoutPage";
import OrdersPage from "@/features/orders/pages/OrdersPage";
import OrderDetailPage from "@/features/orders/pages/OrderDetailPage";
import OrderSuccessPage from "@/features/orders/pages/OrderSuccessPage";
import ProfilePage from "@/features/profile/pages/ProfilePage";

// Info pages (public)
import CustomerServicePage from "@/features/customerService/pages/CustomerServicePage";

// Errors
import NotFound from "@/errors/NotFound";

const AppRoutes = () => {
  return (
    <Routes>

      {/* OAuth2 callback — no layout wrapper */}
      <Route path={PATHS.OAUTH2_SUCCESS} element={<OAuth2Success />} />

      {/* All other routes share the PageWrapper (Navbar + Footer) */}
      <Route element={<PageWrapper />}>

        {/* Public-only routes — redirect to home if already logged in */}
        <Route element={<PublicRoute />}>
          <Route path={PATHS.LOGIN}    element={<Login />} />
          <Route path={PATHS.REGISTER} element={<Register />} />
        </Route>

        {/* ── HOME — banners + categories + featured products ── */}
        <Route path={PATHS.HOME} element={<Home />} />

        {/* Open routes — accessible by anyone */}
        <Route path={PATHS.PRODUCTS}         element={<ProductsPage />} />
        <Route path={PATHS.PRODUCT_DETAIL}   element={<ProductDetailPage />} />
        <Route path={PATHS.CUSTOMER_SERVICE} element={<CustomerServicePage />} />

        {/* Protected routes — redirect to login if not logged in */}
        <Route element={<PrivateRoute />}>
          <Route path={PATHS.CART}          element={<CartPage />} />
          <Route path={PATHS.CHECKOUT}      element={<CheckoutPage />} />
          <Route path={PATHS.ORDER_SUCCESS} element={<OrderSuccessPage />} />
          <Route path={PATHS.ORDERS}        element={<OrdersPage />} />
          <Route path={PATHS.ORDER_DETAIL}  element={<OrderDetailPage />} />
          <Route path={PATHS.PROFILE}       element={<ProfilePage />} />
        </Route>

        {/* 404 */}
        <Route path={PATHS.NOT_FOUND} element={<NotFound />} />

      </Route>

    </Routes>
  );
};

export default AppRoutes;
