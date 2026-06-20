/**
 * ShippingInfo
 *
 * Renders the full shipping address from the normalized address object.
 * Shows: name · phone · line1 · line2 · city, state, zipCode · country
 * Each field is shown only when it has a non-empty value.
 */
const ShippingInfo = ({ address }) => {
  if (!address) {
    return <p className="shipping-info__line">No address on file.</p>;
  }

  const cityLine = [
    address.city,
    address.state,
    address.zipCode,
  ].filter(Boolean).join(", ");

  return (
    <div className="shipping-info">
      {address.name    && <p className="shipping-info__name">{address.name}</p>}
      {address.phone   && <p className="shipping-info__phone">📞 {address.phone}</p>}
      {address.line1   && <p className="shipping-info__line">{address.line1}</p>}
      {address.line2   && <p className="shipping-info__line">{address.line2}</p>}
      <p className="shipping-info__line">
        {cityLine || "Address details unavailable"}
      </p>
      {address.country && <p className="shipping-info__line">{address.country}</p>}
    </div>
  );
};

export default ShippingInfo;
