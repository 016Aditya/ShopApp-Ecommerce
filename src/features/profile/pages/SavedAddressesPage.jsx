/**
 * SavedAddressesPage
 *
 * Route: /profile/addresses
 *
 * UI mirrors the checkout delivery-address panel (CheckoutAddress.jsx):
 * ─ Same card chrome (header strip with step-circle badge, inner padding)
 * ─ Same SavedAddressesList + AddressForm components — zero duplication
 * ─ Adds / edits / deletes saved addresses with inline form
 * ─ Checkout price / order section stripped entirely
 *
 * Prompt note for future AI context:
 * # Final Polish – Unified Delivery + Return Timeline
 *
 * You are a Senior React UI/UX Engineer.
 *
 * Do NOT redesign the Order Details page.
 * The current implementation is good.
 * Apply only subtle refinements.
 * Do NOT modify business logic or APIs.
 *
 * ---
 *
 * 1. Remove Desktop Horizontal Scrollbar
 * Desktop: overflow-visible. Mobile/Tablet (≤md): overflow-x-auto.
 *
 * 2. Simplify Divider
 * Replace “──── RETURNS ────” with “Delivery Completed | Return Process”.
 * color: var(--text-secondary), opacity: 0.7, font-size: 0.85rem, font-weight: 500.
 *
 * 3. Reduce Empty Space
 * Reduce gap between Delivered → divider → Return Requested. Use ~gap: 20px.
 *
 * 4. Compact Return Labels
 * font-size: 12px, line-height: 1.2, max-width: 80px, text-align: center.
 *
 * 5. Improve Active Return Step
 * box-shadow: 0 0 0 4px rgba(245,158,11,.18); transform: scale(1.05). No animations.
 *
 * 6. Connector Colors
 * Delivery completed: #22c55e. Return completed: #f59e0b. Future: var(--border-color).
 *
 * 7. Improve Status Badge
 * background: rgba(245,158,11,.15); border: 1px solid rgba(245,158,11,.3);
 * text: #f59e0b; padding: 6px 12px; border-radius: 999px;
 * font-size: 0.85rem; font-weight: 600.
 *
 * 8. Timeline Width: max-width: 1200px; margin: 0 auto.
 *
 * Regression Safety:
 * ✔ Single timeline remains
 * ✔ No second return card
 * ✔ No white containers
 * ✔ Dark mode remains intact
 * ✔ Return workflow remains intact
 * ✔ Existing order statuses remain intact
 * ✔ Existing APIs remain untouched
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PATHS from "@/routes/paths";
import SavedAddressesList from "@/features/orders/components/SavedAddressesList";
import AddressForm from "@/features/orders/components/AddressForm";
import { useSavedAddresses } from "@/features/orders/hooks/useSavedAddresses";

const SavedAddressesPage = () => {
  const navigate = useNavigate();
  const { addresses, loading, saveAddress, updateAddress, deleteAddress } =
    useSavedAddresses();

  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddForm,    setShowAddForm]    = useState(false);
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
    flash("Address removed.");
  };

  const isFormOpen  = showAddForm || !!editingAddress;
  const isEditMode  = !!editingAddress;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="container-app py-8">

        {/* Back */}
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

        {/* ── Main card — styled like CheckoutAddress ─────────────────── */}
        <div
          className="rounded-lg shadow-sm overflow-hidden"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border-color)",
          }}
        >
          {/* Card header strip (mirrors CheckoutAddress step-1 header) */}
          <div
            className="px-6 py-4"
            style={{
              borderBottom: "1px solid var(--border-color)",
              backgroundColor: "var(--bg-secondary)",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="flex items-center justify-center h-8 w-8 rounded-full text-white font-bold text-sm"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <div>
                  <h1
                    className="text-base font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Saved Addresses
                  </h1>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Manage your delivery locations
                  </p>
                </div>
              </div>

              {/* Add new button — hidden while form is open */}
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
          </div>

          {/* Card body */}
          <div className="p-6">

            {/* Success flash */}
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

            {/* ── Add / Edit form ───────────────────────────────────── */}
            {isFormOpen && (
              <div
                className="mb-6 rounded-xl p-5 sm:p-6"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {isEditMode ? "Edit Address" : "Add New Address"}
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
                    onClick={() => { setShowAddForm(false); setEditingAddress(null); }}
                    aria-label="Close form"
                  >
                    ✕ Cancel
                  </button>
                </div>

                {isEditMode && (
                  <p className="mb-3 text-xs font-medium" style={{ color: "var(--accent)" }}>
                    ✏️ Editing saved address
                  </p>
                )}

                <AddressForm
                  initialData={editingAddress || undefined}
                  onSubmit={isEditMode ? handleUpdate : handleAdd}
                  submitLabel={isEditMode ? "Save Changes" : "Add Address"}
                />
              </div>
            )}

            {/* ── Saved addresses list ─────────────────────────────── */}
            {!isFormOpen && (
              <>
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
                  selectedId={null}
                  loading={loading}
                  onSelect={() => {}} /* no-op: not needed in profile context */
                  onEdit={(addr) => {
                    setEditingAddress(addr);
                    setShowAddForm(false);
                  }}
                  onDelete={handleDelete}
                />

                {/* Add-first CTA when list is empty */}
                {!loading && addresses.length === 0 && (
                  <div className="mt-6">
                    <button
                      type="button"
                      className="w-full border-2 border-dashed font-semibold py-3 rounded-lg transition text-sm"
                      style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--text-secondary)")}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
                      onClick={() => setShowAddForm(true)}
                    >
                      + Add Your First Address
                    </button>
                  </div>
                )}

                {/* Add-another dashed button when addresses exist */}
                {!loading && addresses.length > 0 && (
                  <button
                    type="button"
                    className="mt-4 w-full border-2 border-dashed font-semibold py-3 rounded-lg transition text-sm"
                    style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--text-secondary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
                    onClick={() => { setShowAddForm(true); setEditingAddress(null); }}
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
