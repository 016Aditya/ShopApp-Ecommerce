const PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  OAUTH2_SUCCESS: "/oauth2/success",

  // Products (public)
  PRODUCTS: "/products",
  PRODUCT_DETAIL: "/products/:id",

  // Info Pages (public)
  CUSTOMER_SERVICE: "/customer-service",

  // Protected
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDERS: "/orders",
  ORDER_DETAIL: "/orders/:id",
  ORDER_SUCCESS: "/orders/success",
  PROFILE: "/profile",
  WISHLIST: "/wishlist",

  NOT_FOUND: "*",
};

export const buildPath = (path, id) => path.replace(":id", id);

export { PATHS };
export default PATHS;
