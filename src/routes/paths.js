// Centralised route path constants.
// Use PATHS everywhere — never hardcode strings.

const PATHS = {
  HOME:             "/",
  LOGIN:            "/login",
  REGISTER:         "/register",
  FORGOT_PASSWORD:  "/forgot-password",
  RESET_PASSWORD:   "/reset-password",
  OAUTH2_SUCCESS:   "/oauth2/success",
  PRODUCTS:         "/products",
  PRODUCT_DETAIL:   "/products/:id",
  CART:             "/cart",
  CHECKOUT:         "/checkout",
  ORDERS:           "/orders",
  ORDER_DETAIL:     "/orders/:id",
  ORDER_SUCCESS:    "/order-success",
  PROFILE:          "/profile",
  WISHLIST:         "/wishlist",
  CUSTOMER_SERVICE: "/customer-service",
};

// Named export so `import { PATHS } from '@/routes/paths'` also works
export { PATHS };

/** Build a concrete path by replacing :param tokens.
 *  buildPath(PATHS.PRODUCT_DETAIL, 42)  →  "/products/42"
 */
export const buildPath = (pattern, ...values) => {
  let result = pattern;
  values.forEach((v) => {
    result = result.replace(/:[^/]+/, String(v));
  });
  return result;
};

export default PATHS;
