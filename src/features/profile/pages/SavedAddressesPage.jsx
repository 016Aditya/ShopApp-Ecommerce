/**
 * SavedAddressesPage
 *
 * Route: /profile/addresses
 *
 * UI mirrors the checkout delivery-address panel (CheckoutAddress.jsx):
 * — Same card chrome (header strip with icon badge, inner padding)
 * — Same SavedAddressesList component — zero duplication
 * — Inline controlled address form (same FIELDS array as CheckoutAddress)
 * — Checkout price / order section stripped entirely
 *
 * Fix: previous version imported <AddressForm address onChange> but
 * AddressForm.jsx uses { address, onChange } props and reads address.line1
 * directly — passing { initialData, onSubmit } caused an immediate crash.
 * We now own form state entirely in this file, matching CheckoutAddress.jsx.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Prompt: # Final Polish – Unified Delivery + Return Timeline
 *
 * You are a Senior React UI/UX Engineer.
 * Do NOT redesign the Order Details page.
 * Apply only subtle refinements. Do NOT modify business logic or APIs.
 *
 * 1. No Desktop Scrollbar — overflow-visible desktop, overflow-x-auto ≤md
 * 2. Divider → "Delivery Completed | Return Process"
 *    color: var(--text-secondary), opacity: 0.7, font-size: 0.85rem, font-weight: 500
 * 3. Reduce gap between Delivered → divider → Return Requested (~gap: 20px)
 * 4. Compact return labels: font-size 12px, line-height 1.2, max-width 80px
 * 5. Active return step: box-shadow 0 0 0 4px rgba(245,158,11,.18) + scale(1.05)
 * 6. Connectors: delivery done #22c55e, return done #f59e0b, future var(--border-color)
 * 7. Badge: rgba(245,158,11,.15) bg, rgba(245,158,11,.3) border, #f59e0b text,
 *    padding 6px 12px, border-radius 999px, 0.85rem, 600
 * 8. Timeline max-width 1200px, margin 0 auto
 *
 * Regression: single timeline, no second return card, no white containers,
 * dark mode intact, return workflow intact, APIs untouched.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PATHS from "@/routes/paths";
import SavedAddressesList from "@/features/orders/components/SavedAddressesList";
import { useSavedAddresses } from "@/features/orders/hooks/useSavedAddresses";

// ─ Field definitions — same as CheckoutAddress.jsx ─────────────────────
const FIELDS = [
  { key: "name",    label: "Full Name",             type: "text",  required: true  },
  { key: "email",   label: "Email",                  type: "email", required: false },
  { key: "phone",   label: "Phone",                  type: "tel",   required: true  },
  { key: "line1",   label: "Address",                type: "text",  required: true  },
  { key: "line2",   label: "Apt / Floor (Optional)", type: "text",  required: false },
  { key: "city",    label: "City",                   type: "text",  required: true  },
  { key: "state",   label: "State",                  type: "text",  required: true  },
  { key: "zipCode", label: "Pincode",                type: "text",  required: true  },
  { key: "country", label: "Country",                type: "text",  required: false },
];

const EMPTY = {
  name: "", email: "", phone: "",
  line1: "", line2: "",
  city: "", state: "",
  zipCode: "", country: "India",
};

const inputCls = (hasError) =>
  `w-full px-4 py-2 rounded-lg outline-none transition border ${
    hasError
      ? "border-red-500 focus:ring-2 focus:ring-red-500"
      : "focus:ring-2 focus:ring-blue-500/30"
  }`;

// ─ Component ─────────────────────────────────────────────────────────────────
const SavedAddressesPage = () => {
  const navigate = useNavigate();
  const { addresses, loading, saveAddress, updateAddress, deleteAddress } =
    useSavedAddresses();

  const [formData,   setFormData]   = useState({ ...EMPTY });
  const [errors,     setErrors]     = useState({});
  const [editingId,  setEditingId]  = useState(null);
  const [showForm,   setShowForm]   = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const flash = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const validate = (key, value) => {
    const field = FIELDS.find((f) => f.key === key);
    if (field?.required && !value.trim()) {
      setErrors((p) => ({ ...p, [key]: "This field is required" }));
    } else {
      setErrors((p) => { const n = { ...p }; delete n[key]; return n; });
    }
  };

  const handleChange = (key, value) => {
    validate(key, value);
    setFormData((p) => ({ ...p, [key]: value }));
  };

  const openAdd = () => {
    setFormData({ ...EMPTY });
    setEditingId(null);
    setErrors({});
    setShowForm(true);
  };

  const openEdit = (addr) => {
    setFormData({ ...EMPTY, ...addr, country: addr.country || "India" });
    setEditingId(addr.id);
    setErrors({});
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setErrors({});
  };

  const handleSubmit = () => {
    const newErrors = {};
    let hasErrors = false;
    FIELDS.forEach(({ key, required }) => {
      if (required && !formData[key]?.trim()) {
        newErrors[key] = "This field is required";
        hasErrors = true;
      }
    });
    if (hasErrors) { setErrors(newErrors); return; }

    if (editingId !== null) {
      updateAddress(editingId, formData);
      flash("Address updated successfully.");
    } else {
      saveAddress(formData);
      flash("Address added successfully.");
    }
    closeForm();
  };

  const handleDelete = (id) => {
    if (!window.confirm("Remove this address?")) return;
    deleteAddress(id);
    flash("Address removed.");
  };

  const isEditMode = editingId !== null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="container-app py-8">

        {/* Back */}
        <button
          type="button"
          className="mb-5 flex items-center gap-1.5 text-sm font-medium transition hover:underline"
          style={{ color: "var(--accent)" }}
          onClick={() => navigate(PATHS.PROFILE)}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to My Account
        </button>

        {/* Card */}
        <div
          className="rounded-lg shadow-sm overflow-hidden"
          style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}
        >
          {/* Header strip */}
          <div
            className="px-6 py-4"
            style={{ borderBottom: "1px solid var(--border-color)", backgroundColor: "var(--bg-secondary)" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="flex items-center justify-center h-8 w-8 rounded-full text-white"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <div>
                  <h1 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                    Saved Addresses
                  </h1>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                    Manage your delivery locations
                  </p>
                </div>
              </div>

              {!showForm && (
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition"
                  style={{ backgroundColor: "var(--accent)", color: "#fff", border: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  onClick={openAdd}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Address
                </button>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="p-6">

            {successMsg && (
              <div
                className="mb-4 rounded-lg px-4 py-3 text-sm font-medium"
                style={{
                  backgroundColor: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  color: "#16a34a",
                }}
              >
                ✓ {successMsg}
              </div>
            )}

            {/* Inline form */}
            {showForm && (
              <div
                className="mb-6 rounded-xl p-5 sm:p-6"
                style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {isEditMode ? "✏️ Edit Address" : "Add New Address"}
                  </h2>
                  <button
                    type="button"
                    className="rounded px-3 py-1 text-xs font-medium transition"
                    style={{
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border-color)",
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-tertiary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    onClick={closeForm}
                  >
                    ✕ Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  {FIELDS.map(({ key, label, type, required }) => (
                    <div
                      key={key}
                      className={key === "line1" || key === "line2" ? "md:col-span-2" : ""}
                    >
                      <label
                        htmlFor={`sa-${key}`}
                        className="block text-sm font-medium mb-2"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <input
                        id={`sa-${key}`}
                        type={type}
                        className={inputCls(!!errors[key])}
                        style={{
                          backgroundColor: "var(--bg-tertiary)",
                          color: "var(--text-primary)",
                          borderColor: errors[key] ? undefined : "var(--border-color)",
                        }}
                        value={formData[key] ?? ""}
                        onChange={(e) => handleChange(key, e.target.value)}
                        placeholder={label}
                      />
                      {errors[key] && (
                        <p className="text-red-500 text-sm mt-1">{errors[key]}</p>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
                >
                  {isEditMode ? "✓ Update Address" : "✓ Save Address"}
                </button>
              </div>
            )}

            {/* List */}
            {!showForm && (
              <>
                <div className="mb-4">
                  <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {addresses.length > 0
                      ? `${addresses.length} saved address${addresses.length > 1 ? "es" : ""}`
                      : "No addresses saved yet"}
                  </h2>
                </div>

                <SavedAddressesList
                  addresses={addresses}
                  selectedId={null}
                  loading={loading}
                  onSelect={() => {}}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />

                {!loading && addresses.length === 0 && (
                  <div className="mt-6">
                    <button
                      type="button"
                      className="w-full border-2 border-dashed font-semibold py-3 rounded-lg transition text-sm"
                      style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--text-secondary)")}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
                      onClick={openAdd}
                    >
                      + Add Your First Address
                    </button>
                  </div>
                )}

                {!loading && addresses.length > 0 && (
                  <button
                    type="button"
                    className="mt-4 w-full border-2 border-dashed font-semibold py-3 rounded-lg transition text-sm"
                    style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--text-secondary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
                    onClick={openAdd}
                  >
                    + Add New Address
                  </button>
                )}
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default SavedAddressesPage;
