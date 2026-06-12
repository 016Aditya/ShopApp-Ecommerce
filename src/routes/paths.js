const PATHS = {
  // Public
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  OAUTH2_SUCCESS: "/oauth2/success",
  
  // Products (public)
  PRODUCTS: "/products",
  PRODUCT_DETAIL: "/products/:id",

  // Info Pages (public)
  CUSTOMER_SERVICE: "/customer-service", // 👈 ADDED THIS FOR YOUR NAVBAR

  // Protected
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDERS: "/orders",
  ORDER_DETAIL: "/orders/:id",
  PROFILE: "/profile",

  // Utility
  NOT_FOUND: "*",
};

// Helper to build dynamic paths e.g. buildPath(PATHS.PRODUCT_DETAIL, "42")
export const buildPath = (path, id) => path.replace(":id", id);

export { PATHS };
export default PATHS;