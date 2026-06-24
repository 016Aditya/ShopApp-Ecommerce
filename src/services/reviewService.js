import api from "@/api/api";
import { API_ENDPOINTS } from "@/api/apiEndpoints";

// POST /api/reviews
export const addReview = async ({ productId, rating, comment }) => {
  const { data } = await api.post(API_ENDPOINTS.REVIEWS, {
    productId,
    rating,
    comment,
  });
  return data;
};

// GET /api/reviews/product/:productId
export const getReviewsByProduct = async (productId) => {
  const { data } = await api.get(`${API_ENDPOINTS.REVIEWS}/product/${productId}`);
  return data;
};

// PUT /api/reviews/:id
export const updateReview = async (id, { rating, comment }) => {
  const { data } = await api.put(`${API_ENDPOINTS.REVIEWS}/${id}`, {
    rating,
    comment,
  });
  return data;
};

// DELETE /api/reviews/:id
export const deleteReview = async (id) => {
  await api.delete(`${API_ENDPOINTS.REVIEWS}/${id}`);
};