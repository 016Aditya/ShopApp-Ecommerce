import { Routes, Route } from "react-router-dom";
import PATHS from "./paths";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

// Layouts
import PageWrapper from "@/components/layout/PageWrapper";

// Auth pages
import Login          from "@/features/auth/pages/Login";
import Register       from "@/features/auth/pages/Register";
import OAuth2Success  from "@/features/auth/pages/OAuth2Success";
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
import ResetPassword  from "@/features/auth/pages/ResetPassword";

// Core pages (public)
import HomePage          from "@/features/home/pages/HomePage";
import ProductsPage      from "@/features/products/pages/ProductsPage";
import ProductDetailPage from "@/features/products/pages/ProductDetailPage";
import CustomerServicePage from "@/features/customerService/pages/CustomerServicePage";
import WishlistPage      from "@/features/wishlist/pages/WishlistPage";

// Protected pages
import CartPage        from "@/features/cart/pages/CartPage";
import CheckoutPage    from "@/features/orders/pages/CheckoutPage";
import OrdersPage      from "@/features/orders/pages/OrdersPage";
import OrderDetailPage from "@/features/orders/pages/OrderDetailPage";
import OrderSuccessPage from "@/features/orders/pages/OrderSuccessPage";
import ProfilePage     from "@/features/profile/pages/ProfilePage";

// Errors
import NotFound from "@/errors/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      {/* OAuth2 callback — no layout wrapper */}
      <Route path={PATHS.OAUTH2_SUCCESS} element={<OAuth2Success />} />

      {/* All other routes share the PageWrapper (Navbar + Footer) */}
      <Route element={<PageWrapper />}>

        {/* Public-only routes (blocked when already logged in) */}
        <Route element={<PublicRoute />}>
          <Route path={PATHS.LOGIN}           element={<Login />} />
          <Route path={PATHS.REGISTER}        element={<Register />} />
          <Route path={PATHS.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={PATHS.RESET_PASSWORD}  element={<ResetPassword />} />
        </Route>

        {/* Open routes */}
        <Route path={PATHS.HOME}           element={<HomePage />} />
        <Route path={PATHS.PRODUCTS}       element={<ProductsPage />} />
        <Route path={PATHS.PRODUCT_DETAIL} element={<ProductDetailPage />} />
        <Route path={PATHS.CUSTOMER_SERVICE} element={<CustomerServicePage />} />
        <Route path={PATHS.WISHLIST}       element={<WishlistPage />} />

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path={PATHS.CART}          element={<CartPage />} />
          <Route path={PATHS.CHECKOUT}      element={<CheckoutPage />} />
          <Route path={PATHS.ORDERS}        element={<OrdersPage />} />
          <Route path={PATHS.ORDER_DETAIL}  element={<OrderDetailPage />} />
          <Route path={PATHS.ORDER_SUCCESS} element={<OrderSuccessPage />} />
          <Route path={PATHS.PROFILE}       element={<ProfilePage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
