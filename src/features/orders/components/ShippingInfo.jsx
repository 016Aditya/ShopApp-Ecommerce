/**
 * ShippingInfo
 *
 * Renders the full shipping address from the normalized address object
 * that comes directly from the backend via normalizeOrder().
 *
 * SECURITY FIX
 * ────────────
 * The previous version attempted to "enrich" sparse backend addresses by
 * reading from localStorage ("saved_addresses") and fuzzy-matching on
 * city + state.  This caused another user's saved address to appear on an
 * order detail page whenever:
 *   • The backend returned only city/state (sparse address), AND
 *   • Another user's saved address happened to share the same city/state.
 *
 * Fix: removed all localStorage reads entirely.  ShippingInfo now renders
 * exclusively what the backend returns (already normalized by normalizeOrder).
 * If a field is missing it is simply omitted — no cross-user data is ever read.
 *
 * Field display order:
 *   1. Full Name
 *   2. Phone
 *   3. Street (line1)
 *   4. Landmark / Apt (line2)
 *   5. City, State - Pincode
 *   6. Country
 *
 * Each field renders only when non-empty.
 * No undefined / null / stray commas are ever shown.
 */

const ShippingInfo = ({ address }) => {
  if (!address) {
    return <p className="shipping-info__line">No address on file.</p>;
  }

  // City, State - Pincode  (omit any missing segment cleanly)
  const cityPart    = address.city    || "";
  const statePart   = address.state   || "";
  const pincodePart = address.zipCode || "";

  let cityLine = "";
  if (cityPart && statePart) {
    cityLine = `${cityPart}, ${statePart}`;
  } else {
    cityLine = cityPart || statePart;
  }
  if (pincodePart) {
    cityLine = cityLine ? `${cityLine} - ${pincodePart}` : pincodePart;
  }

  const hasAnyContent =
    address.name  || address.phone ||
    address.line1 || address.line2 ||
    cityLine      || address.country;

  if (!hasAnyContent) {
    return <p className="shipping-info__line">No address on file.</p>;
  }

  return (
    <div className="shipping-info">
      {address.name    && <p className="shipping-info__name">{address.name}</p>}
      {address.phone   && <p className="shipping-info__phone">📞 {address.phone}</p>}
      {address.line1   && <p className="shipping-info__line">{address.line1}</p>}
      {address.line2   && <p className="shipping-info__line">{address.line2}</p>}
      {cityLine        && <p className="shipping-info__line">{cityLine}</p>}
      {address.country && <p className="shipping-info__line">{address.country}</p>}
    </div>
  );
};

export default ShippingInfo;
