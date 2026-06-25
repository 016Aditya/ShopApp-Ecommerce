/**
 * queryKeys.js — Phase 2A
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
 *   queryKeys.products.lists()                      → ['products', 'list']
 *   queryKeys.products.featured()                   → ['products', 'featured']
 *   queryKeys.products.detail(42)                   → ['products', 'detail', 42]
 *   queryKeys.products.byCategory('Electronics')    → ['products', 'list', 'category', 'Electronics']
 *   queryKeys.products.byCatAndSub('Electronics', 'Phones')
 *                                                   → ['products', 'list', 'category', 'Electronics', 'sub', 'Phones']
 *   queryKeys.products.search('iphone')             → ['products', 'search', 'iphone']
 *
 * Phase 2B will add:
 *   queryKeys.orders.*
 *   queryKeys.reviews.*
 *   queryKeys.profile.*
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
};
