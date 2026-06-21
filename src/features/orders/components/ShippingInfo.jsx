/**
 * ShippingInfo — polish update
 *
 * Changes:
 * - Phone icon colour changed to #ec4899 (pink) per spec
 * - Country rendered in secondary text colour
 * - No logic change
 */

const ShippingInfo = ({ address }) => {
  if (!address) {
    return <p className="shipping-info__line">No address on file.</p>;
  }

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
      {address.name  && <p className="shipping-info__name">{address.name}</p>}
      {address.phone && (
        <p className="shipping-info__phone">
          <span style={{ color: "#ec4899" }}>📞</span> {address.phone}
        </p>
      )}
      {address.line1   && <p className="shipping-info__line">{address.line1}</p>}
      {address.line2   && <p className="shipping-info__line">{address.line2}</p>}
      {cityLine        && <p className="shipping-info__line">{cityLine}</p>}
      {address.country && (
        <p className="shipping-info__line shipping-info__country">{address.country}</p>
      )}
    </div>
  );
};

export default ShippingInfo;
