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

  /**
   * updateOrderReturn — optimistic update after return is initiated.
   * Updates the matching order in both the list and selectedOrder
   * without requiring a full refetch from the server.
   *
   * @param {string} orderId  - the order's id
   * @param {object} updates  - partial order fields to merge
   *   e.g. { status, returnRequestedAt, refundStatus }
   */
  updateOrderReturn: (orderId, updates) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, ...updates } : o
      ),
      selectedOrder:
        state.selectedOrder?.id === orderId
          ? { ...state.selectedOrder, ...updates }
          : state.selectedOrder,
    })),
}));
