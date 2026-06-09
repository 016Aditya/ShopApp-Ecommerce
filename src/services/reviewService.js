import api from "@/api/api";
import { API_ENDPOINTS } from "@/api/apiEndpoints";

// POST /api/reviews
// Body: { productId, userId, rating, comment }
export const addReview = async ({ productId, userId, rating, comment }) => {
  const { data } = await api.post(API_ENDPOINTS.REVIEWS, {
    productId,
    userId,
    rating,
    comment,
  });
  return data;
};

// POST /api/reviews/search
// Body: { productId }
export const getReviewsByProduct = async (productId) => {
  const { data } = await api.post(`${API_ENDPOINTS.REVIEWS}/search`, {
    productId,
  });
  return data; // ReviewDto.Response[]
};

// PUT /api/reviews/:id
// Body: { rating, comment }
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