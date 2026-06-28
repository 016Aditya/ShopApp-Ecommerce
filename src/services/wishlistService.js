import api from '@/api/api';

/**
 * wishlistService — pure async functions, no React, no hooks.
 *
 * Backend controller routes (WishlistController.java):
 *   GET    /api/wishlist/user/{userId}                    → get wishlist
 *   POST   /api/wishlist/user/{userId}/add/{productId}    → add product
 *   DELETE /api/wishlist/user/{userId}/remove/{productId} → remove product
 *   DELETE /api/wishlist/user/{userId}/clear              → clear wishlist
 *
 * FIX: previous service used query params (?productId=...) for add/remove.
 * The backend uses PATH VARIABLES (/add/{productId}, /remove/{productId}).
 * This caused Spring to return 500 because no route matched the query-param
 * variant — the endpoint simply didn't exist at that URL.
 */

export const getWishlist = async (userId) => {
  const { data } = await api.get(`/wishlist/user/${userId}`);
  return data;
};

/**
 * addToWishlist
 * POST /api/wishlist/user/{userId}/add/{productId}
 */
export const addToWishlist = async (userId, productId) => {
  const { data } = await api.post(`/wishlist/user/${userId}/add/${productId}`);
  return data;
};

/**
 * removeFromWishlist
 * DELETE /api/wishlist/user/{userId}/remove/{productId}
 */
export const removeFromWishlist = async (userId, productId) => {
  const { data } = await api.delete(`/wishlist/user/${userId}/remove/${productId}`);
  return data;
};

/**
 * clearWishlist
 * DELETE /api/wishlist/user/{userId}/clear
 */
export const clearWishlist = async (userId) => {
  await api.delete(`/wishlist/user/${userId}/clear`);
};
