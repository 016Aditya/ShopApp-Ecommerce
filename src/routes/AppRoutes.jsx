import { Routes, Route } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import PrivateRoute from "@/routes/PrivateRoute";
import PublicRoute from "@/routes/PublicRoute";
import NotFound from "@/errors/NotFound";

import Home from "@/features/products/pages/Home";
import Shop from "@/features/products/pages/Shop";
import ProductDetail from "@/features/products/pages/ProductDetail";
import Login from "@/features/auth/pages/Login";
import Register from "@/features/auth/pages/Register";
import OAuth2Success from "@/features/auth/pages/OAuth2Success";
import Cart from "@/features/cart/pages/Cart";
import Checkout from "@/features/orders/pages/Checkout";
import Orders from "@/features/orders/pages/Orders";
import Profile from "@/features/profile/pages/Profile";

function AppRoutes() {
  return (
    <Routes>
      <Route path={PATHS.HOME} element={<Home />} />
      <Route path={PATHS.SHOP} element={<Shop />} />
      <Route path={PATHS.PRODUCT_DETAIL} element={<ProductDetail />} />
      <Route path={PATHS.CART} element={<Cart />} />

      <Route element={<PublicRoute />}>
        <Route path={PATHS.LOGIN} element={<Login />} />
        <Route path={PATHS.REGISTER} element={<Register />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path={PATHS.CHECKOUT} element={<Checkout />} />
        <Route path={PATHS.ORDERS} element={<Orders />} />
        <Route path={PATHS.PROFILE} element={<Profile />} />
      </Route>

      <Route path={PATHS.OAUTH2_SUCCESS} element={<OAuth2Success />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;