import api from "@/api/api";
import { API_ENDPOINTS } from "@/api/apiEndpoints";

export const createOrder = async (orderData) => {
  const { data } = await api.post(API_ENDPOINTS.ORDERS, orderData);
  return data;
};

export const getOrdersByUser = async (userId) => {
  const { data } = await api.get(`${API_ENDPOINTS.ORDERS}/user/${userId}`);
  if (import.meta.env.DEV) {
    console.log("Orders API response (raw):", data);
    // Log detailed structure for debugging
    if (Array.isArray(data)) {
      data.forEach((order, idx) => {
        console.log(`Order ${idx} structure:`, {
          id: order.id,
          items: order.items,
          orderItems: order.orderItems,
          products: order.products,
          totalItems: order.items?.length || order.orderItems?.length || order.products?.length || 0,
          firstItemKeys: Object.keys(order.items?.[0] || order.orderItems?.[0] || order.products?.[0] || {}),
        });
      });
    } else if (data?.orders) {
      console.log("Orders from data.orders:", data.orders);
    }
  }
  return data;
};

export const getOrderById = async (id) => {
  const { data } = await api.get(`${API_ENDPOINTS.ORDERS}/${id}`);
  if (import.meta.env.DEV) {
    console.log("Order detail API response (raw):", data);
    // Log detailed structure for debugging
    console.log("Order structure:", {
      id: data.id,
      status: data.status,
      items: data.items,
      orderItems: data.orderItems,
      products: data.products,
      totalItems: data.items?.length || data.orderItems?.length || data.products?.length || 0,
      firstItemKeys: Object.keys(data.items?.[0] || data.orderItems?.[0] || data.products?.[0] || {}),
      firstItem: data.items?.[0] || data.orderItems?.[0] || data.products?.[0],
    });
  }
  return data;
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await api.patch(`${API_ENDPOINTS.ORDERS}/${id}/status`, { status });
  return data;
};

// Cancel order — PATCH status to CANCELLED
export const cancelOrder = async (id) => {
  const { data } = await api.patch(`${API_ENDPOINTS.ORDERS}/${id}/status`, {
    status: "CANCELLED",
  });
  return data;
};

export const deleteOrder = async (id) => {
  await api.delete(`${API_ENDPOINTS.ORDERS}/${id}`);
};
