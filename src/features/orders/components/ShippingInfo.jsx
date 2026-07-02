import { useState } from "react";

/**
 * ShippingInfo — short address shown by default.
 * A chevron button toggles the full address inline.
 *
 * Reads backend Address fields:
 *   fullName, phoneNumber, addressLine1, addressLine2, city, state, zipCode, country
 * Also accepts the old short aliases for backwards compatibility.
 */
const ChevronIcon = ({ open }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      transition: "transform 220ms ease",
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
      display: "block",
    }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ShippingInfo = ({ address }) => {
  const [expanded, setExpanded] = useState(false);

  if (!address) {
    return <p className="shipping-info__line">No address on file.</p>;
  }

  // Accept both backend field names and old short aliases
  const name    = address.fullName     || address.name     || "";
  const phone   = address.phoneNumber  || address.phone    || "";
  const line1   = address.addressLine1 || address.line1    || address.street || "";
  const line2   = address.addressLine2 || address.line2    || "";
  const city    = address.city    || "";
  const state   = address.state   || "";
  const zipCode = address.zipCode || address.pincode || address.zip || "";
  const country = address.country || "India";

  // Short one-liner: "City, State - ZipCode"
  let shortLine = "";
  if (city && state)   shortLine = `${city}, ${state}`;
  else                 shortLine = city || state;
  if (zipCode)         shortLine = shortLine ? `${shortLine} - ${zipCode}` : zipCode;

  const hasAnyContent = name || phone || line1 || line2 || shortLine || country;
  if (!hasAnyContent) {
    return <p className="shipping-info__line">No address on file.</p>;
  }

  return (
    <div className="shipping-info">

      {/* Short address row with expand toggle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <div>
          {shortLine && (
            <p className="shipping-info__line" style={{ margin: 0 }}>
              {shortLine}
            </p>
          )}
          {!expanded && country && (
            <p
              className="shipping-info__line shipping-info__country"
              style={{ margin: "2px 0 0", opacity: 0.7, fontSize: "13px" }}
            >
              {country}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label={expanded ? "Hide full address" : "Show full address"}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            background: "none",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "50%",
            width: "28px",
            height: "28px",
            cursor: "pointer",
            color: "var(--text-muted, #94a3b8)",
            transition: "border-color 0.15s, color 0.15s",
            padding: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
            e.currentTarget.style.color = "var(--text-muted, #94a3b8)";
          }}
        >
          <ChevronIcon open={expanded} />
        </button>
      </div>

      {/* Full address revealed on expand */}
      {expanded && (
        <div
          style={{
            marginTop: "12px",
            paddingTop: "12px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            flexDirection: "column",
            gap: "3px",
          }}
        >
          {name  && (
            <p className="shipping-info__name" style={{ margin: 0, fontWeight: 600 }}>
              {name}
            </p>
          )}
          {phone && (
            <p className="shipping-info__phone" style={{ margin: 0 }}>
              <span style={{ color: "#ec4899" }}>📞</span> {phone}
            </p>
          )}
          {line1 && <p className="shipping-info__line" style={{ margin: 0 }}>{line1}</p>}
          {line2 && <p className="shipping-info__line" style={{ margin: 0 }}>{line2}</p>}
          {shortLine && (
            <p className="shipping-info__line" style={{ margin: 0 }}>{shortLine}</p>
          )}
          {country && (
            <p className="shipping-info__line shipping-info__country" style={{ margin: 0 }}>
              {country}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ShippingInfo;
