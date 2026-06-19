import { useState } from "react";

/**
 * All addresses arrive already normalized to frontend keys:
 *   { id, name, phone, line1, line2, city, state, zipCode, country }
 * (guaranteed by useSavedAddresses normalizeToForm)
 */

const SELECTED_CARD_STYLE = {
  border:          "1.5px solid #22c55e",
  backgroundColor: "rgba(34, 197, 94, 0.07)",
  boxShadow:       "0 0 0 1px rgba(34, 197, 94, 0.15)",
};

const DEFAULT_CARD_STYLE = {
  border:          "1px solid var(--border-color)",
  backgroundColor: "var(--card-bg)",
  boxShadow:       "none",
};

const SavedAddressesList = ({
  addresses,
  selectedId,
  onSelect,   // (address: object) => void  — passes FULL address, not just id
  onEdit,     // (address: object) => void
  onDelete,   // (id) => void
  loading,
}) => {
  const [expandedId, setExpandedId] = useState(null);

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded"
            style={{ backgroundColor: "var(--bg-tertiary)" }} />
        ))}
      </div>
    );
  }

  if (!addresses.length) {
    return (
      <div className="py-6 text-center" style={{ color: "var(--text-secondary)" }}>
        <p>No saved addresses yet</p>
      </div>
    );
  }

  return (
    <>
      {/* accent-color for native radio fill */}
      <style>{`
        .addr-radio {
          accent-color: #22c55e;
          width: 16px; height: 16px;
          cursor: pointer; flex-shrink: 0;
        }
      `}</style>

      <div className="space-y-3">
        {addresses.map((addr) => {
          const isSelected = selectedId === addr.id;
          const isExpanded = expandedId === addr.id;

          // ── Collapsed preview line ─────────────────────────────────────
          // "Aditya Singh"  /  "GODAM, Kolkata"
          const previewLine = [
            addr.line1,
            addr.city,
          ]
            .filter(Boolean)
            .join(", ");

          return (
            <div
              key={addr.id}
              className="cursor-pointer rounded-lg p-4 transition-all duration-150"
              style={isSelected ? SELECTED_CARD_STYLE : DEFAULT_CARD_STYLE}
              onClick={() => onSelect(addr)}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") { e.preventDefault(); onSelect(addr); }
              }}
            >
              <div className="flex items-start gap-3">
                {/* Radio */}
                <input
                  type="radio"
                  className="addr-radio mt-0.5"
                  checked={isSelected}
                  onChange={() => onSelect(addr)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Select address: ${addr.line1}`}
                />

                <div className="min-w-0 flex-1">
                  {/* Row 1: name + badges */}
                  <div className="mb-0.5 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {addr.name || "—"}
                    </span>
                    {addr.phone && (
                      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                        {addr.phone}
                      </span>
                    )}
                    {isSelected && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                        style={{ backgroundColor: "rgba(34,197,94,0.15)", color: "#16a34a" }}
                      >
                        ✓ Selected
                      </span>
                    )}
                  </div>

                  {/* Row 2: short address preview */}
                  <p className="text-sm leading-snug" style={{ color: "var(--text-secondary)" }}>
                    {previewLine || "—"}
                  </p>

                  {/* Show more / less toggle */}
                  <button
                    type="button"
                    className="mt-1 text-xs font-medium transition hover:underline"
                    style={{ color: "var(--accent)" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedId(isExpanded ? null : addr.id);
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
                      {addr.line1 && <p>{addr.line1}</p>}
                      {addr.line2 && <p>{addr.line2}</p>}
                      <p>
                        {[addr.city, addr.state].filter(Boolean).join(", ")}
                        {addr.zipCode ? ` — ${addr.zipCode}` : ""}
                      </p>
                      <p style={{ color: "var(--text-primary)" }}>
                        {addr.country || "India"}
                      </p>
                    </div>
                  )}

                  {/* Edit / Remove */}
                  {(onEdit || onDelete) && (
                    <div className="mt-3 flex gap-3">
                      {onEdit && (
                        <button
                          type="button"
                          className="text-xs font-medium transition hover:underline"
                          style={{ color: "var(--accent)" }}
                          onClick={(e) => { e.stopPropagation(); onEdit(addr); }}
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          className="text-xs font-medium transition hover:underline"
                          style={{ color: "var(--error-text)" }}
                          onClick={(e) => { e.stopPropagation(); onDelete(addr.id); }}
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
