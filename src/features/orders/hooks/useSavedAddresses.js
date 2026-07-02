import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

/**
 * useSavedAddresses
 *
 * FIELD NAME CONTRACT
 * ───────────────────
 * Backend Address entity exact fields:
 *   fullName, phoneNumber, addressLine1, addressLine2,
 *   city, state, zipCode, country
 *
 * Frontend form uses:
 *   name, phone, line1, line2, city, state, zipCode, country, email
 *
 * normalizeToForm()  → backend keys → frontend form keys
 * normalizeToStore() → frontend form keys → backend entity keys
 *
 * IMPORTANT: backend uses `zipCode` (NOT postalCode).
 */

/** Ensure every key expected by the form exists (country defaults to India) */
export const normalizeToForm = (addr = {}) => ({
  name:    addr.name    ?? addr.fullName      ?? "",
  email:   addr.email   ?? "",
  phone:   addr.phone   ?? addr.phoneNumber   ?? "",
  line1:   addr.line1   ?? addr.addressLine1  ?? "",
  line2:   addr.line2   ?? addr.addressLine2  ?? "",
  city:    addr.city    ?? "",
  state:   addr.state   ?? "",
  zipCode: addr.zipCode ?? addr.postalCode    ?? "",
  country: addr.country ?? "India",
});

/**
 * Map frontend form keys → backend Address entity keys for the order payload.
 * Backend field: zipCode (confirmed from Address.java — NOT postalCode).
 */
export const normalizeToStore = (addr = {}) => ({
  fullName:     addr.name    ?? "",
  phoneNumber:  addr.phone   ?? "",
  addressLine1: addr.line1   ?? "",
  addressLine2: addr.line2   ?? "",
  city:         addr.city    ?? "",
  state:        addr.state   ?? "",
  zipCode:      addr.zipCode ?? "",   // ← was postalCode (WRONG), backend field is zipCode
  country:      addr.country ?? "India",
  email:        addr.email   ?? "",
});

/** Returns the per-user localStorage key, or null if no user is logged in. */
const storageKey = (userId) =>
  userId ? `saved_addresses:${userId}` : null;

export const useSavedAddresses = () => {
  const userId = useAuthStore((s) => s.user?.id ?? s.user?._id ?? null);

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    setLoading(true);
    const key = storageKey(userId);

    if (!key) {
      setAddresses([]);
      setLoading(false);
      return;
    }

    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        const normalized = (Array.isArray(parsed) ? parsed : []).map((a) => ({
          id:        a.id,
          createdAt: a.createdAt,
          ...normalizeToForm(a),
        }));
        setAddresses(normalized);
      } else {
        setAddresses([]);
      }
    } catch (err) {
      console.error("[useSavedAddresses] load error:", err);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const persist = (list) => {
    const key = storageKey(userId);
    if (!key) return;
    setAddresses(list);
    localStorage.setItem(key, JSON.stringify(list));
  };

  const saveAddress = (formData) => {
    const entry = {
      id:        Date.now(),
      createdAt: new Date().toISOString(),
      ...normalizeToForm(formData),
    };
    persist([...addresses, entry]);
    return entry;
  };

  const updateAddress = (id, formData) => {
    const updated = addresses.map((addr) =>
      addr.id === id
        ? { ...addr, ...normalizeToForm(formData), id, createdAt: addr.createdAt }
        : addr
    );
    persist(updated);
  };

  const deleteAddress = (id) => {
    persist(addresses.filter((a) => a.id !== id));
  };

  return { addresses, loading, saveAddress, updateAddress, deleteAddress };
};
