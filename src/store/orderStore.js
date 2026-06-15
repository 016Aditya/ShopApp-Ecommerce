import { create } from 'zustand';

export const useOrderStore = create((set) => ({
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,

  setOrders: (orders) => set({ orders }),
  setSelectedOrder: (order) => set({ selectedOrder: order }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}));
