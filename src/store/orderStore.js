// src/store/orderStore.js
import { create } from 'zustand';

/**
 * orderStore — Zustand global store for order state.
 *
 * ADDED: updateOrderReturn(orderId, updatedFields)
 *   Performs an optimistic in-memory update for the matching order in the
 *   list AND selectedOrder, so the OrdersPage list reflects the return
 *   status immediately after the customer confirms — without a full refetch.
 *
 *   Called by OrderDetailPage after a successful PATCH /api/orders/{id}/return.
 *
 *   All existing actions (setOrders, setSelectedOrder, setLoading, setError,
 *   clearError) are untouched.
 */
export const useOrderStore = create((set) => ({
  orders:        [],
  selectedOrder: null,
  loading:       false,
  error:         null,

  setOrders:        (orders)  => set({ orders }),
  setSelectedOrder: (order)   => set({ selectedOrder: order }),
  setLoading:       (loading) => set({ loading }),
  setError:         (error)   => set({ error }),
  clearError:       ()        => set({ error: null }),

  // ── NEW ──────────────────────────────────────────────────────────────────
  // Optimistically update a single order's return fields in both the list
  // and selectedOrder without requiring a network refetch.
  //
  // Usage (from OrderDetailPage):
  //   useOrderStore.getState().updateOrderReturn(id, {
  //     status:             "RETURN_REQUESTED",
  //     returnRequestedAt:  isoString,
  //     refundStatus:       "PENDING",
  //   });
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
