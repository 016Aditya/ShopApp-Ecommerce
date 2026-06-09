import { useState, useEffect, useCallback, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import { getOrdersByUser, getOrderById, createOrder } from "@/services/orderService";

// ─── All orders for logged-in user ────────────────────────────────────────
export const useOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getOrdersByUser(user.id);
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, fetchOrders };
};

// ─── Single order by ID ────────────────────────────────────────────────────
export const useOrder = (id) => {
  const [order, setOrder]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || "Order not found");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return { order, loading, error };
};

// ─── Place order ───────────────────────────────────────────────────────────
export const usePlaceOrder = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const placeOrder = async ({ productIds, quantity, address }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createOrder({
        userId: user.id,
        productIds,
        quantity,
        address,
      });
      return data; // caller navigates on success
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { placeOrder, loading, error };
};