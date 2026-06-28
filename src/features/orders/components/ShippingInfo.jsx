/**
 * ShippingInfo — reads backend Address fields:
 *   fullName, phoneNumber, addressLine1, addressLine2, city, state, zipCode, country
 *
 * The backend Address entity uses camelCase compound names (fullName, addressLine1)
 * NOT the short aliases (name, line1) the old version expected.
 * Both aliases are accepted for backwards compatibility with manually-built addresses.
 */
const ShippingInfo = ({ address }) => {
  if (!address) {
    return <p className="shipping-info__line">No address on file.</p>;
  }

  // Accept both backend field names and old short aliases
  const name     = address.fullName     || address.name     || "";
  const phone    = address.phoneNumber  || address.phone    || "";
  const line1    = address.addressLine1 || address.line1    || address.street || "";
  const line2    = address.addressLine2 || address.line2    || "";
  const city     = address.city    || "";
  const state    = address.state   || "";
  const zipCode  = address.zipCode || address.pincode || address.zip || "";
  const country  = address.country || "India";

  let cityLine = "";
  if (city && state)   cityLine = `${city}, ${state}`;
  else                 cityLine = city || state;
  if (zipCode)         cityLine = cityLine ? `${cityLine} - ${zipCode}` : zipCode;

  const hasAnyContent = name || phone || line1 || line2 || cityLine || country;
  if (!hasAnyContent) {
    return <p className="shipping-info__line">No address on file.</p>;
  }

  return (
    <div className="shipping-info">
      {name   && <p className="shipping-info__name">{name}</p>}
      {phone  && (
        <p className="shipping-info__phone">
          <span style={{ color: "#ec4899" }}>📞</span> {phone}
        </p>
      )}
      {line1   && <p className="shipping-info__line">{line1}</p>}
      {line2   && <p className="shipping-info__line">{line2}</p>}
      {cityLine && <p className="shipping-info__line">{cityLine}</p>}
      {country && (
        <p className="shipping-info__line shipping-info__country">{country}</p>
      )}
    </div>
  );
};

export default ShippingInfo;
