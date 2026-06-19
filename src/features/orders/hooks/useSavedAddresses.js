import { useState, useEffect } from "react";

const STORAGE_KEY = "saved_addresses";

/**
 * FIELD NAME CONTRACT
 * -------------------
 * Form / EMPTY_ADDRESS / CheckoutPage uses "frontend keys":
 *   name, phone, line1, line2, city, state, zipCode, country, email
 *
 * localStorage stores addresses with the SAME frontend keys + { id, createdAt }.
 *
 * normalizeToForm()  → strips id/createdAt, guarantees all frontend keys exist
 * normalizeToStore() → maps frontend keys → backend DTO keys for the order payload
 *
 * This single source of truth ends all field-mismatch bugs.
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

export const useSavedAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading]     = useState(true);

  // ── Load from localStorage on mount ──────────────────────────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Normalize every stored address so legacy entries with wrong keys still work
        const normalized = (Array.isArray(parsed) ? parsed : []).map((a) => ({
          id:        a.id,
          createdAt: a.createdAt,
          ...normalizeToForm(a),
        }));
        setAddresses(normalized);
      }
    } catch (err) {
      console.error("[useSavedAddresses] load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = (list) => {
    setAddresses(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
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
