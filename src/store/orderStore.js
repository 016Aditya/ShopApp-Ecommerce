// src/store/orderStore.js
import { create } from 'zustand';

/**
 * orderStore — Zustand global store for order UI state.
 *
 * Step 7 refactor: all server-state (orders[], selectedOrder, loading,
 * error, setOrders, setSelectedOrder, setLoading, setError, clearError,
 * updateOrderReturn) has been removed.
 *
 * TanStack Query (useQueryOrders.js / useQueryReturn.js) is now the
 * single source of truth for all order and return server-state.
 *
 * This store owns ONLY ephemeral UI flags that have no network equivalent:
 *   selectedOrderId  — which order is open in a drawer / detail panel
 *
 * Follows the same pattern as cartStore after its Step 4 refactor.
 */
export const useOrderStore = create((set) => ({
  // ── UI state ────────────────────────────────────────────────────────────
  selectedOrderId: null,

  setSelectedOrderId: (id) => set({ selectedOrderId: id }),
  clearSelectedOrder: ()   => set({ selectedOrderId: null }),
}));
