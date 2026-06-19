import { useState } from "react";
import { useSavedAddresses } from "../hooks/useSavedAddresses";
import SavedAddressesList from "./SavedAddressesList";

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

/** Default empty address — country always defaults to India */
export const EMPTY_ADDRESS = {
  name: "", email: "", phone: "",
  line1: "", line2: "",
  city: "", state: "",
  zipCode: "", country: "India",
};

const inputClass = (hasError) =>
  `w-full px-4 py-2 rounded-lg outline-none transition border ${
    hasError
      ? "border-red-500 focus:ring-2 focus:ring-red-500"
      : "focus:ring-2 focus:ring-blue-500/30"
  }`;

const CheckoutAddress = ({ address, onChange }) => {
  const [errors, setErrors]             = useState({});
  const [showNewAddress, setShowNew]    = useState(false);
  const [editingId, setEditingId]       = useState(null);   // id of address being edited
  const [saveThisAddress, setSaveThis]  = useState(false);

  const { addresses, saveAddress, updateAddress, deleteAddress, loading } =
    useSavedAddresses();

  // ── Validation ────────────────────────────────────────────────────────────
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
    onChange({ ...address, [key]: value });
  };

  // ── Select a saved address ────────────────────────────────────────────────
  // onSelect now receives the full address OBJECT (not just id)
  const handleSelectSaved = (selectedAddr) => {
    // Push the full address (with id) into parent so CheckoutPage has the id
    onChange({
      ...EMPTY_ADDRESS,
      ...selectedAddr,
      country: selectedAddr.country || "India",
    });
    setShowNew(false);
    setEditingId(null);
  };

  // ── Edit a saved address ──────────────────────────────────────────────────
  const handleEdit = (addr) => {
    // Pre-fill the form with the address being edited
    onChange({
      ...EMPTY_ADDRESS,
      ...addr,
      country: addr.country || "India",
    });
    setEditingId(addr.id);   // remember which id we're editing
    setShowNew(true);
    setErrors({});
  };

  // ── Save / update address ─────────────────────────────────────────────────
  const handleSaveOrUpdate = () => {
    if (editingId !== null) {
      // UPDATE existing
      updateAddress(editingId, address);
      setEditingId(null);
    } else {
      // CREATE new
      const saved = saveAddress(address);
      // Select it immediately so the parent gets the id
      onChange({ ...address, id: saved.id });
    }
    setSaveThis(false);
    setShowNew(false);
  };

  // ── Derived state ─────────────────────────────────────────────────────────
  const showForm     = showNewAddress || addresses.length === 0;
  const selectedId   = address.id ?? null;
  const isEditMode   = editingId !== null;

  return (
    <div
      className="rounded-lg shadow-sm overflow-hidden"
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--border-color)",
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4"
        style={{
          borderBottom: "1px solid var(--border-color)",
          backgroundColor: "var(--bg-secondary)",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white font-bold text-sm">
            1
          </span>
          <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            Delivery Address
          </h2>
        </div>
      </div>

      <div className="p-6">
        {/* ── Saved Addresses List ──────────────────────────────────────── */}
        {!showForm && addresses.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
              Saved Addresses
            </h3>

            <SavedAddressesList
              addresses={addresses}
              selectedId={selectedId}
              onSelect={handleSelectSaved}   // ← receives full address object
              onEdit={handleEdit}             // ← receives full address object
              onDelete={(id) => {
                deleteAddress(id);
                // If deleted address was selected, reset form
                if (selectedId === id) onChange({ ...EMPTY_ADDRESS });
              }}
              loading={loading}
            />

            <button
              type="button"
              onClick={() => {
                onChange({ ...EMPTY_ADDRESS });
                setEditingId(null);
                setSaveThis(false);
                setShowNew(true);
              }}
              className="mt-4 w-full border-2 border-dashed font-semibold py-3 rounded-lg transition"
              style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--text-secondary)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
            >
              + Add New Address
            </button>
          </div>
        )}

        {/* ── Address Form (new or edit) ────────────────────────────────── */}
        {showForm && (
          <>
            {isEditMode && (
              <p className="mb-4 text-sm font-medium" style={{ color: "var(--accent)" }}>
                ✏️ Editing saved address
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {FIELDS.map(({ key, label, type, required }) => (
                <div
                  key={key}
                  className={key === "line1" || key === "line2" ? "md:col-span-2" : ""}
                >
                  <label
                    htmlFor={`addr-${key}`}
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <input
                    id={`addr-${key}`}
                    type={type}
                    className={inputClass(!!errors[key])}
                    style={{
                      backgroundColor: "var(--bg-tertiary)",
                      color: "var(--text-primary)",
                      borderColor: errors[key] ? undefined : "var(--border-color)",
                    }}
                    value={address[key] ?? ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder={label}
                  />
                  {errors[key] && (
                    <p className="text-red-500 text-sm mt-1">{errors[key]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Save checkbox — only shown when adding a NEW address */}
            {!isEditMode && (
              <div
                className="mb-4 flex items-start gap-3 p-4 rounded-lg"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <input
                  type="checkbox"
                  id="save-address"
                  checked={saveThisAddress}
                  onChange={(e) => setSaveThis(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded cursor-pointer mt-0.5"
                />
                <label htmlFor="save-address" className="flex-1 cursor-pointer">
                  <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                    Save this address for future use
                  </p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    You can edit or delete this address anytime
                  </p>
                </label>
              </div>
            )}

            {/* Save / Update button */}
            {(saveThisAddress || isEditMode) && (
              <button
                type="button"
                onClick={handleSaveOrUpdate}
                className="mb-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
              >
                {isEditMode ? "✓ Update Address" : "✓ Save Address"}
              </button>
            )}

            {/* Back to saved list */}
            {addresses.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setShowNew(false);
                  setEditingId(null);
                  setErrors({});
                }}
                className="w-full border-2 font-semibold py-2 rounded-lg transition"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--text-secondary)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-secondary)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                ← Back to Saved Addresses
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutAddress;
