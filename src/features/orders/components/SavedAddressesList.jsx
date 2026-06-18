import { useState } from "react";

const SavedAddressesList = ({ addresses, selectedId, onSelect, onEdit, onDelete, loading }) => {
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
    <div className="space-y-3">
      {addresses.map((address) => {
        const isSelected = selectedId === address.id;
        const isExpanded = expandedId === address.id;

        return (
          <div
            key={address.id}
            className="cursor-pointer rounded-lg border p-4 transition"
            style={{
              backgroundColor: isSelected ? "var(--card-bg-elevated)" : "var(--card-bg)",
              borderColor: isSelected ? "var(--info-border)" : "var(--border-color)",
            }}
            onClick={() => onSelect(address)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <input
                    type="radio"
                    name="address"
                    checked={isSelected}
                    onChange={() => onSelect(address)}
                    className="h-4 w-4 cursor-pointer"
                    style={{ accentColor: "var(--brand-primary)" }}
                  />
                  <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                    {address.name}
                  </h3>
                </div>

                {isExpanded ? (
                  <div className="ml-7 space-y-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <p>{address.line1}</p>
                    {address.line2 && <p>{address.line2}</p>}
                    <p>
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    {address.country && <p>{address.country}</p>}
                    <p style={{ color: "var(--text-primary)" }}>Phone: {address.phone}</p>
                    {address.email && <p style={{ color: "var(--text-primary)" }}>Email: {address.email}</p>}
                  </div>
                ) : (
                  <p className="ml-7 line-clamp-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {address.line1}, {address.city}, {address.state} {address.zipCode}
                  </p>
                )}
              </div>

              <div className="ml-4 flex gap-2">
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    setExpandedId(isExpanded ? null : address.id);
                  }}
                  className="rounded px-3 py-1 text-sm transition"
                  style={{ color: "var(--info-text)" }}
                >
                  {isExpanded ? "Hide" : "View"}
                </button>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdit(address);
                  }}
                  className="rounded px-3 py-1 text-sm transition"
                  style={{ color: "var(--info-text)" }}
                >
                  Edit
                </button>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    if (confirm("Delete this address?")) {
                      onDelete(address.id);
                    }
                  }}
                  className="rounded px-3 py-1 text-sm transition"
                  style={{ color: "var(--error-text)" }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SavedAddressesList;
