/**
 * prefetch.js — Stage 1: Route prefetching during idle time.
 *
 * Uses requestIdleCallback (with a setTimeout fallback) to preload
 * likely next-page chunks WITHOUT blocking rendering.
 *
 * Rules:
 *  - Home      → preload Products
 *  - Products  → preload ProductDetail
 *  - Cart      → preload Checkout
 *
 * Each import() is deduplicated by the browser module registry —
 * calling it twice is free after the first load.
 */

const idle = (cb) => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(cb, { timeout: 2000 });
  } else {
    setTimeout(cb, 200);
  }
};

export const prefetchProductsPage = () =>
  idle(() => import('@/features/products/pages/ProductsPage'));

export const prefetchProductDetailPage = () =>
  idle(() => import('@/features/products/pages/ProductDetailPage'));

export const prefetchCheckoutPage = () =>
  idle(() => import('@/features/orders/pages/CheckoutPage'));

export const prefetchOrdersPage = () =>
  idle(() => import('@/features/orders/pages/OrdersPage'));

export const prefetchCartPage = () =>
  idle(() => import('@/features/cart/pages/CartPage'));
