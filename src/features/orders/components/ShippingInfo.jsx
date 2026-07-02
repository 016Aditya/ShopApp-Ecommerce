import { useState } from "react";

/**
 * ShippingInfo — mirrors the SavedAddressesList collapsed/expanded format.
 *
 * Collapsed: name + phone, then "line1, city" preview + Show more button
 * Expanded:  full address (line1, line2, city+state+zip, country)
 *
 * Accepts backend field names (fullName, phoneNumber, addressLine1, addressLine2)
 * and old short aliases for backwards compatibility.
 */
const ShippingInfo = ({ address }) => {
  const [expanded, setExpanded] = useState(false);

  if (!address) {
    return <p style={{ color: "var(--text-secondary)" }}>No address on file.</p>;
  }

  // Normalise field names — backend uses fullName/phoneNumber/addressLine1/addressLine2
  const name    = address.fullName     || address.name     || "";
  const phone   = address.phoneNumber  || address.phone    || "";
  const line1   = address.addressLine1 || address.line1    || address.street || "";
  const line2   = address.addressLine2 || address.line2    || "";
  const city    = address.city    || "";
  const state   = address.state   || "";
  const zipCode = address.zipCode || address.pincode || address.zip || "";
  const country = address.country || "India";

  // Same preview line as SavedAddressesList: "line1, city"
  const previewLine = [line1, city].filter(Boolean).join(", ");

  return (
    <div>
      {/* Row 1: name + phone */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "8px",
          marginBottom: "2px",
        }}
      >
        {name && (
          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            {name}
          </span>
        )}
        {phone && (
          <span
            style={{
              fontSize: "14px",
              color: "var(--text-secondary)",
            }}
          >
            {phone}
          </span>
        )}
      </div>

      {/* Row 2: short preview */}
      <p
        style={{
          fontSize: "14px",
          lineHeight: 1.4,
          color: "var(--text-secondary)",
          margin: 0,
        }}
      >
        {previewLine || "—"}
      </p>

      {/* Show more / Show less */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        style={{
          marginTop: "4px",
          fontSize: "12px",
          fontWeight: 500,
          color: "var(--accent)",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
      >
        {expanded ? "Show less" : "Show more"}
      </button>

      {/* Expanded full address — same fields as SavedAddressesList */}
      {expanded && (
        <div
          style={{
            marginTop: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            fontSize: "14px",
            color: "var(--text-secondary)",
          }}
        >
          {line1 && <p style={{ margin: 0 }}>{line1}</p>}
          {line2 && <p style={{ margin: 0 }}>{line2}</p>}
          <p style={{ margin: 0 }}>
            {[city, state].filter(Boolean).join(", ")}
            {zipCode ? ` — ${zipCode}` : ""}
          </p>
          <p style={{ margin: 0, color: "var(--text-primary)" }}>
            {country}
          </p>
        </div>
      )}
    </div>
  );
};

export default ShippingInfo;
