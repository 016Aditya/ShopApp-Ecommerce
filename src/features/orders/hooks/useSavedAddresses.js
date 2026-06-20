import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

/**
 * useSavedAddresses
 *
 * SECURITY FIX
 * ────────────
 * Previously addresses were stored under the global key "saved_addresses",
 * so every user on the same browser shared the same address list — a serious
 * privacy / data-leakage bug.
 *
 * Fix: the localStorage key is now `saved_addresses:<userId>`.  Each user gets
 * an isolated slot.  On logout the key is simply not read (user is null), so
 * a new login never sees the previous user's addresses.
 *
 * FIELD NAME CONTRACT
 * ───────────────────
 * Form / EMPTY_ADDRESS / CheckoutPage uses "frontend keys":
 *   name, phone, line1, line2, city, state, zipCode, country, email
 *
 * localStorage stores addresses with the SAME frontend keys + { id, createdAt }.
 *
 * normalizeToForm()  → strips id/createdAt, guarantees all frontend keys exist
 * normalizeToStore() → maps frontend keys → backend DTO keys for the order payload
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

/** Map frontend form keys → backend DTO keys for the order payload */
export const normalizeToStore = (addr = {}) => ({
  fullName:     addr.name    ?? "",
  phoneNumber:  addr.phone   ?? "",
  addressLine1: addr.line1   ?? "",
  addressLine2: addr.line2   ?? "",
  city:         addr.city    ?? "",
  state:        addr.state   ?? "",
  postalCode:   addr.zipCode ?? "",
  country:      addr.country ?? "India",
  email:        addr.email   ?? "",
});

/** Returns the per-user localStorage key, or null if no user is logged in. */
const storageKey = (userId) =>
  userId ? `saved_addresses:${userId}` : null;

export const useSavedAddresses = () => {
  // Read userId directly from the Zustand store (not via useAuth context)
  // so this hook never depends on AuthContext re-renders.
  const userId = useAuthStore((s) => s.user?.id ?? s.user?._id ?? null);

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading]     = useState(true);

  // ── Load from localStorage whenever the logged-in user changes ───────────
  useEffect(() => {
    setLoading(true);
    const key = storageKey(userId);

    if (!key) {
      // No user logged in — show empty list, never expose another user's data.
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
  }, [userId]); // re-runs on login / logout / user switch

  const persist = (list) => {
    const key = storageKey(userId);
    if (!key) return; // silently skip if no user — should never happen in practice
    setAddresses(list);
    localStorage.setItem(key, JSON.stringify(list));
  };

  // ── Save new address ──────────────────────────────────────────────────────
  const saveAddress = (formData) => {
    const entry = {
      id:        Date.now(),
      createdAt: new Date().toISOString(),
      ...normalizeToForm(formData),
    };
    persist([...addresses, entry]);
    return entry;
  };

  // ── Update existing address ───────────────────────────────────────────────
  const updateAddress = (id, formData) => {
    const updated = addresses.map((addr) =>
      addr.id === id
        ? { ...addr, ...normalizeToForm(formData), id, createdAt: addr.createdAt }
        : addr
    );
    persist(updated);
  };

  // ── Delete address ────────────────────────────────────────────────────────
  const deleteAddress = (id) => {
    persist(addresses.filter((a) => a.id !== id));
  };

  return { addresses, loading, saveAddress, updateAddress, deleteAddress };
};
