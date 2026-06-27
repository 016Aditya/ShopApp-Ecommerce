import api from '@/api/api';

/**
 * wishlistService — pure async functions, no React, no hooks.
 *
 * All functions call the Spring Boot backend wishlist endpoints.
 * Adjust URL paths below to match your @RequestMapping in the backend.
 *
 * Assumed backend routes (update if your controller uses different paths):
 *   GET    /api/wishlist/user/:userId   → returns wishlist items array
 *   POST   /api/wishlist/user/:userId/add?productId=:productId
 *   DELETE /api/wishlist/user/:userId/remove?productId=:productId
 *
 * If your backend uses a single /api/wishlist route (token-identified),
 * remove the userId path param and update the URLs accordingly.
 */

/**
 * getWishlist
 * Fetch the wishlist for a user.
 * @param {string} userId
 * @returns {Promise<Array>} raw item array from backend
 */
export const getWishlist = async (userId) => {
  const { data } = await api.get(`/wishlist/user/${userId}`);
  return data;
};

/**
 * addToWishlist
 * Add a product to the user's wishlist.
 * @param {string} userId
 * @param {string} productId
 */
export const addToWishlist = async (userId, productId) => {
  const { data } = await api.post(
    `/wishlist/user/${userId}/add`,
    null,
    { params: { productId } }
  );
  return data;
};

/**
 * removeFromWishlist
 * Remove a product from the user's wishlist.
 * @param {string} userId
 * @param {string} productId
 */
export const removeFromWishlist = async (userId, productId) => {
  const { data } = await api.delete(
    `/wishlist/user/${userId}/remove`,
    { params: { productId } }
  );
  return data;
};
