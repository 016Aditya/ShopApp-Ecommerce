/**
 * queryKeys.js — Phase 2A + 2B
 *
 * Centralized query key factory for all TanStack Query keys.
 *
 * Design rules:
 *  1. Every key is an array (required by TanStack Query for partial matching).
 *  2. All keys within a feature share the same root segment so
 *     `invalidateQueries({ queryKey: ['products'] })` clears ALL product caches.
 *  3. Keys are pure functions — no side effects, no imports.
 *
 * Usage:
 *   queryKeys.products.all()                        → ['products']
 *   queryKeys.products.detail(42)                   → ['products', 'detail', 42]
 *   queryKeys.orders.byUser('u1')                   → ['orders', 'user', 'u1']
 *   queryKeys.orders.detail('o1')                   → ['orders', 'detail', 'o1']
 *   queryKeys.reviews.byProduct('p5')               → ['reviews', 'product', 'p5']
 *
 * Phase 2C will add:
 *   queryKeys.profile.*
 *   queryKeys.wishlist.*
 *   queryKeys.savedAddresses.*
 */
export const queryKeys = {
  products: {
    /** Root key — invalidates ALL product queries */
    all: () => ['products'],

    /** All list-type queries (all, category, search) */
    lists: () => ['products', 'list'],

    /** GET /api/products */
    allProducts: () => ['products', 'list', 'all'],

    /** GET /api/products/featured */
    featured: () => ['products', 'featured'],

    /** GET /api/products/:id */
    detail: (id) => ['products', 'detail', Number(id)],

    /** GET /api/products/category/:category */
    byCategory: (category) => ['products', 'list', 'category', category],

    /** GET /api/products/category/:category/subcategory/:sub */
    byCatAndSub: (category, subcategory) => [
      'products', 'list', 'category', category, 'sub', subcategory,
    ],

    /** GET /api/products/search?keyword=... */
    search: (keyword) => ['products', 'search', keyword?.trim().toLowerCase()],
  },

  orders: {
    /** Root key — invalidates ALL order queries */
    all: () => ['orders'],

    /** GET /api/orders/user/:userId */
    byUser: (userId) => ['orders', 'user', String(userId)],

    /** GET /api/orders/:id */
    detail: (id) => ['orders', 'detail', String(id)],
  },

  reviews: {
    /** Root key — invalidates ALL review queries */
    all: () => ['reviews'],

    /** GET /api/reviews/product/:productId */
    byProduct: (productId) => ['reviews', 'product', String(productId)],
  },
};
