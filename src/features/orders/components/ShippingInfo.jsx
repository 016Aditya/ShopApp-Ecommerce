/**
 * ShippingInfo
 *
 * Renders the full shipping address from the normalized address object.
 * Field priority (from normalizeAddress in normalizeOrder.js):
 *   name    ← address.name | address.fullName | address.recipientName
 *   phone   ← address.phone | address.phoneNumber | address.mobile
 *   line1   ← address.line1 | address.addressLine1 | address.street
 *   line2   ← address.line2 | address.addressLine2 | address.landmark
 *   city    ← address.city | address.town
 *   state   ← address.state | address.region
 *   zipCode ← address.zipCode | address.postalCode | address.pincode
 *   country ← address.country (defaults to "India")
 *
 * Each field renders only when non-empty.
 * No undefined / null / stray commas are ever shown.
 */
const ShippingInfo = ({ address }) => {
  if (!address) {
    return <p className="shipping-info__line">No address on file.</p>;
  }

  // City, State - Pincode  (omit any missing segment cleanly)
  const cityPart    = address.city  || "";
  const statePart   = address.state || "";
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
    address.name || address.phone ||
    address.line1 || address.line2 ||
    cityLine || address.country;

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
