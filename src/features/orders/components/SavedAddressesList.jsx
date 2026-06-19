import { useState } from "react";

/*
  Address selection indicator fix:
  - accent-color on radio/checkbox → browser-native green fill
  - selected card: green border + subtle green tinted background
  - works in both light and dark mode via CSS variables
*/

const SELECTED_CARD_STYLE = {
  border: "1.5px solid #22c55e",
  backgroundColor: "rgba(34, 197, 94, 0.07)",
  boxShadow: "0 0 0 1px rgba(34, 197, 94, 0.15)",
};

const DEFAULT_CARD_STYLE = {
  border: "1px solid var(--border-color)",
  backgroundColor: "var(--card-bg)",
  boxShadow: "none",
};

const SavedAddressesList = ({
  addresses,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
  loading,
}) => {
  const [expandedId, setExpandedId] = useState(null);

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-24 animate-pulse rounded"
            style={{ backgroundColor: "var(--bg-tertiary)" }}
          />
        ))}
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="py-6 text-center" style={{ color: "var(--text-secondary)" }}>
        <p>No saved addresses yet</p>
      </div>
    );
  }

  return (
    <>
      {/* Global accent-color injection for radio & checkbox */}
      <style>{`
        .address-radio,
        .address-checkbox {
          accent-color: #22c55e;
          width: 16px;
          height: 16px;
          cursor: pointer;
          flex-shrink: 0;
        }
      `}</style>

      <div className="space-y-3">
        {addresses.map((address) => {
          const isSelected = selectedId === address.id;
          const isExpanded = expandedId === address.id;

          return (
            <div
              key={address.id}
              className="cursor-pointer rounded-lg p-4 transition-all duration-150"
              style={isSelected ? SELECTED_CARD_STYLE : DEFAULT_CARD_STYLE}
              onClick={() => onSelect(address.id)}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  onSelect(address.id);
                }
              }}
            >
              <div className="flex items-start gap-3">
                {/* Radio indicator */}
                <input
                  type="radio"
                  className="address-radio mt-0.5"
                  checked={isSelected}
                  onChange={() => onSelect(address.id)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Select address: ${address.addressLine1}`}
                />

                <div className="min-w-0 flex-1">
                  {/* Name + type badge row */}
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {address.fullName}
                    </span>
                    {address.addressType && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                        style={{
                          backgroundColor: isSelected
                            ? "rgba(34, 197, 94, 0.15)"
                            : "var(--bg-tertiary)",
                          color: isSelected ? "#16a34a" : "var(--text-tertiary)",
                        }}
                      >
                        {address.addressType}
                      </span>
                    )}
                    {isSelected && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                        style={{
                          backgroundColor: "rgba(34, 197, 94, 0.15)",
                          color: "#16a34a",
                        }}
                      >
                        ✓ Selected
                      </span>
                    )}
                  </div>

                  {/* Address line preview */}
                  <p
                    className="text-sm leading-snug"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {address.addressLine1}
                    {address.addressLine2 && `, ${address.addressLine2}`}
                  </p>

                  {/* Expand toggle */}
                  <button
                    type="button"
                    className="mt-1 text-xs font-medium transition hover:underline"
                    style={{ color: "var(--accent)" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedId(isExpanded ? null : address.id);
                    }}
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? "Show less" : "Show more"}
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div
                      className="mt-2 space-y-0.5 text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <p>
                        {address.city}, {address.state} — {address.postalCode}
                      </p>
                      <p>{address.country}</p>
                      {address.phoneNumber && <p>Phone: {address.phoneNumber}</p>}
                    </div>
                  )}

                  {/* Action buttons */}
                  {(onEdit || onDelete) && (
                    <div className="mt-3 flex gap-3">
                      {onEdit && (
                        <button
                          type="button"
                          className="text-xs font-medium transition hover:underline"
                          style={{ color: "var(--accent)" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(address);
                          }}
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          className="text-xs font-medium transition hover:underline"
                          style={{ color: "var(--error-text)" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(address.id);
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SavedAddressesList;
