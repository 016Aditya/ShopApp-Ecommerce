/**
 * featureFlags.js
 *
 * Toggle features without touching component code.
 * Set a flag to false to hide an entire feature from the UI.
 *
 * For environment-specific flags, you can gate them on env.IS_PROD:
 *   import { env } from './env';
 *   export const FLAGS = { ENABLE_OAUTH: env.IS_PROD };
 */
export const FLAGS = {
  /** Show star ratings and review form on product detail page */
  ENABLE_REVIEWS: true,

  /** Allow users to request returns / refunds from order detail */
  ENABLE_RETURNS: true,

  /** Show wishlist icon in Navbar and /wishlist route */
  ENABLE_WISHLIST: true,

  /** Google / GitHub OAuth login buttons on auth pages */
  ENABLE_OAUTH: false,

  /** Show coupon / promo code input in cart summary */
  ENABLE_COUPONS: false,

  /** Real-time order tracking via WebSocket */
  ENABLE_REALTIME_TRACKING: false,
};
