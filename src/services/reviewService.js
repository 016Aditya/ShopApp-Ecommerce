import api from "@/services/api";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const addReview = async (reviewData) => {
  const { data } = await api.post(API_ENDPOINTS.REVIEWS, reviewData);
  return data;
};

export const getReviewsByProduct = async (productId) => {
  const { data } = await api.post(`${API_ENDPOINTS.REVIEWS}/search`, {
    productId,
  });
  return data;
};

export const updateReview = async (id, reviewData) => {
  const { data } = await api.put(`${API_ENDPOINTS.REVIEWS}/${id}`, reviewData);
  return data;
};

export const deleteReview = async (id) => {
  const { data } = await api.delete(`${API_ENDPOINTS.REVIEWS}/${id}`);
  return data;
};