import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PATHS from "@/routes/paths";
import SavedAddressesList from "@/features/orders/components/SavedAddressesList";
import AddressForm from "@/features/orders/components/AddressForm";
import { useSavedAddresses } from "@/features/orders/hooks/useSavedAddresses";

/**
 * SavedAddressesPage
 * Standalone page at /profile/addresses.
 * Full CRUD: view, add, edit, delete saved addresses.
 * Reuses existing SavedAddressesList + AddressForm — zero duplication.
 */
const SavedAddressesPage = () => {
  const navigate = useNavigate();
  const { addresses, loading, saveAddress, updateAddress, deleteAddress } =
    useSavedAddresses();

  const [editingAddress, setEditingAddress] = useState(null); // null = not editing
  const [showAddForm,    setShowAddForm]    = useState(false);
  const [selectedId,     setSelectedId]     = useState(null);
  const [successMsg,     setSuccessMsg]     = useState("");

  const flash = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleAdd = (formData) => {
    saveAddress(formData);
    setShowAddForm(false);
    flash("Address added successfully.");
  };

  const handleUpdate = (formData) => {
    updateAddress(editingAddress.id, formData);
    setEditingAddress(null);
    flash("Address updated successfully.");
  };

  const handleDelete = (id) => {
    if (!window.confirm("Remove this address?")) return;
    deleteAddress(id);
    if (selectedId === id) setSelectedId(null);
    flash("Address removed.");
  };

  const isFormOpen = showAddForm || !!editingAddress;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="container-app py-8">

        {/* ── Breadcrumb / back ─────────────────────────────────────── */}
        <button
          type="button"
          className="mb-5 flex items-center gap-1.5 text-sm font-medium transition hover:underline"
          style={{ color: "var(--accent)" }}
          onClick={() => navigate(PATHS.PROFILE)}
          aria-label="Back to My Account"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to My Account
        </button>

        {/* ── Page title ────────────────────────────────────────────── */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1
              className="text-xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Saved Addresses
            </h1>
            <p
              className="mt-0.5 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Manage your delivery locations
            </p>
          </div>

          {/* Add new — hidden while a form is already open */}
          {!isFormOpen && (
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition"
              style={{
                backgroundColor: "var(--accent)",
                color: "#fff",
                border: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              onClick={() => { setShowAddForm(true); setEditingAddress(null); }}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add New Address
            </button>
          )}
        </div>

        {/* ── Success flash ─────────────────────────────────────────── */}
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

        {/* ── Add / Edit form ───────────────────────────────────────── */}
        {isFormOpen && (
          <div
            className="mb-6 rounded-xl p-5 sm:p-6"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2
                className="text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h2>
              <button
                type="button"
                className="rounded p-1 text-xs transition hover:opacity-70"
                style={{ color: "var(--text-secondary)" }}
                onClick={() => { setShowAddForm(false); setEditingAddress(null); }}
                aria-label="Close form"
              >
                ✕ Cancel
              </button>
            </div>

            <AddressForm
              initialData={editingAddress || undefined}
              onSubmit={editingAddress ? handleUpdate : handleAdd}
              submitLabel={editingAddress ? "Save Changes" : "Add Address"}
            />
          </div>
        )}

        {/* ── Addresses list ────────────────────────────────────────── */}
        <div
          className="rounded-xl p-5 sm:p-6"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border-color)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {/* Section header */}
          <div className="mb-4 flex items-center justify-between">
            <h2
              className="text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {addresses.length > 0
                ? `${addresses.length} saved address${addresses.length > 1 ? "es" : ""}`
                : "No addresses saved yet"}
            </h2>
          </div>

          <SavedAddressesList
            addresses={addresses}
            selectedId={selectedId}
            loading={loading}
            onSelect={(addr) => setSelectedId(addr.id)}
            onEdit={(addr) => { setEditingAddress(addr); setShowAddForm(false); }}
            onDelete={handleDelete}
          />

          {/* Empty CTA when no form is open */}
          {!loading && addresses.length === 0 && !isFormOpen && (
            <div className="mt-4 text-center">
              <button
                type="button"
                className="rounded-lg px-5 py-2.5 text-sm font-semibold transition"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "#fff",
                  border: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                onClick={() => setShowAddForm(true)}
              >
                + Add Your First Address
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedAddressesPage;
