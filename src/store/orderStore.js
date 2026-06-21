import { create } from 'zustand';

/**
 * orderStore.js
 *
 * ADDED: updateOrderReturn(orderId, updatedFields)
 *   Performs an optimistic in-memory update for the matching order in the
 *   list AND the selectedOrder, so the OrdersPage list reflects the return
 *   status immediately after the customer confirms — without a full refetch.
 *
 *   All existing actions are untouched.
 */
export const useOrderStore = create((set) => ({
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,

  setOrders:        (orders)  => set({ orders }),
  setSelectedOrder: (order)   => set({ selectedOrder: order }),
  setLoading:       (loading) => set({ loading }),
  setError:         (error)   => set({ error }),
  clearError:       ()        => set({ error: null }),

  // ── NEW ──────────────────────────────────────────────────────────────────
  // Optimistically update a single order's return fields in both the list
  // and selectedOrder without requiring a network refetch.
  updateOrderReturn: (orderId, updatedFields) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, ...updatedFields } : o
      ),
      selectedOrder:
        state.selectedOrder?.id === orderId
          ? { ...state.selectedOrder, ...updatedFields }
          : state.selectedOrder,
    })),
}));
