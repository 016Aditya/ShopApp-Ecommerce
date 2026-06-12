const PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  OAUTH2_SUCCESS: "/oauth2/success",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: "/products/:id",
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDERS: "/orders",
  ORDER_DETAIL: "/orders/:id",
  ORDER_SUCCESS: "/orders/success",
  PROFILE: "/profile",
  CUSTOMER_SERVICE: "/customer-service",
  NOT_FOUND: "*",
};

export const buildPath = (path, id) => path.replace(":id", id);
export default PATHS;
