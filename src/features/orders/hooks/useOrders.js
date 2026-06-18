import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createOrder, getOrderById, getOrdersByUser } from "@/services/orderService";
import { normalizeOrder, normalizeOrdersResponse } from "../utils/normalizeOrder";

export const useOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    if (!user?.id) {
      setOrders([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getOrdersByUser(user.id);
      setOrders(normalizeOrdersResponse(data));
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

export const useOrder = (id) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setOrder(null);
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getOrderById(id);
        setOrder(normalizeOrder(data));
      } catch (err) {
        setError(err.response?.data?.message || "Order not found");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  return { order, loading, error };
};

export const usePlaceOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const placeOrder = async (orderData) => {
    setLoading(true);
    setError(null);

    try {
      return await createOrder(orderData);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to place order";
      setError(message);
      throw new Error(message, { cause: err });
    } finally {
      setLoading(false);
    }
  };

  return { placeOrder, loading, error };
};
