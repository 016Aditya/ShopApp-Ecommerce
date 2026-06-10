import { Routes, Route } from "react-router-dom";
import PATHS from "./paths";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

import PageWrapper from "@/components/layout/PageWrapper";

import Login from "@/features/auth/pages/Login";
import Register from "@/features/auth/pages/Register";
import OAuth2Success from "@/features/auth/pages/OAuth2Success";

import HomePage from "@/features/home/pages/HomePage";
import ProductsPage from "@/features/products/pages/ProductsPage";
import ProductDetailPage from "@/features/products/pages/ProductDetailPage";

import CartPage from "@/features/cart/pages/CartPage";
import CheckoutPage from "@/features/orders/pages/CheckoutPage";
import OrdersPage from "@/features/orders/pages/OrdersPage";
import OrderDetailPage from "@/features/orders/pages/OrderDetailPage";
import ProfilePage from "@/features/profile/pages/ProfilePage";

import NotFound from "@/errors/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={PATHS.OAUTH2_SUCCESS} element={<OAuth2Success />} />

      <Route element={<PageWrapper />}>
        <Route element={<PublicRoute />}>
          <Route path={PATHS.LOGIN}    element={<Login />} />
          <Route path={PATHS.REGISTER} element={<Register />} />
        </Route>

        {/* HOME is now its own page */}
        <Route path={PATHS.HOME}           element={<HomePage />} />
        <Route path={PATHS.PRODUCTS}       element={<ProductsPage />} />
        <Route path={PATHS.PRODUCT_DETAIL} element={<ProductDetailPage />} />

        <Route element={<PrivateRoute />}>
          <Route path={PATHS.CART}         element={<CartPage />} />
          <Route path={PATHS.CHECKOUT}     element={<CheckoutPage />} />
          <Route path={PATHS.ORDERS}       element={<OrdersPage />} />
          <Route path={PATHS.ORDER_DETAIL} element={<OrderDetailPage />} />
          <Route path={PATHS.PROFILE}      element={<ProfilePage />} />
        </Route>

        <Route path={PATHS.NOT_FOUND} element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
