import { useState, useEffect } from "react";

const ADDRESSES_STORAGE_KEY = "saved_addresses";

export const useSavedAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load addresses from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ADDRESSES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setAddresses(Array.isArray(parsed) ? parsed : []);
      }
    } catch (err) {
      console.error("Error loading saved addresses:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save a new address
  const saveAddress = (address) => {
    try {
      const newAddress = {
        id: Date.now(),
        ...address,
        createdAt: new Date().toISOString(),
      };
      const updated = [...addresses, newAddress];
      setAddresses(updated);
      localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(updated));
      return newAddress;
    } catch (err) {
      console.error("Error saving address:", err);
      throw err;
    }
  };

  // Update an existing address
  const updateAddress = (id, address) => {
    try {
      const updated = addresses.map((addr) =>
        addr.id === id ? { ...addr, ...address } : addr
      );
      setAddresses(updated);
      localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Error updating address:", err);
      throw err;
    }
  };

  // Delete an address
  const deleteAddress = (id) => {
    try {
      const updated = addresses.filter((addr) => addr.id !== id);
      setAddresses(updated);
      localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Error deleting address:", err);
      throw err;
    }
  };

  return {
    addresses,
    loading,
    saveAddress,
    updateAddress,
    deleteAddress,
  };
};
