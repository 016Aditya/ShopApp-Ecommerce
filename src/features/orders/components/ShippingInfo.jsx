/**
 * ShippingInfo
 *
 * Renders the full shipping address from the normalized address object.
 *
 * SPARSE ADDRESS FALLBACK (for old orders placed before full normalization):
 * If the backend only returns city/state/country (no name/phone/street),
 * we attempt to enrich from localStorage saved_addresses by matching city+state.
 * This is a best-effort display fix — no backend change needed.
 *
 * Field display order:
 *   1. Full Name
 *   2. Phone
 *   3. Street (line1)
 *   4. Landmark (line2)
 *   5. City, State - Pincode
 *   6. Country
 *
 * Each field renders only when non-empty.
 * No undefined / null / stray commas are ever shown.
 */

const readSavedAddresses = () => {
  try {
    const stored = localStorage.getItem("saved_addresses");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/**
 * If the backend address is "sparse" (missing name/phone/street),
 * try to find a matching saved address by city+state and merge it in.
 */
const enrichWithLocalStorage = (address) => {
  const isSparse = !address.name && !address.phone && !address.line1;
  if (!isSparse) return address;

  const saved = readSavedAddresses();
  if (!saved.length) return address;

  const cityLower  = (address.city  || "").toLowerCase().trim();
  const stateLower = (address.state || "").toLowerCase().trim();

  const match = saved.find((a) => {
    const aC = (a.city  || "").toLowerCase().trim();
    const aS = (a.state || "").toLowerCase().trim();
    return cityLower && aC === cityLower && stateLower && aS === stateLower;
  });

  if (!match) return address;

  // Merge: saved address fields fill in only what the backend didn't return.
  return {
    name:    address.name    || match.name    || "",
    phone:   address.phone   || match.phone   || "",
    line1:   address.line1   || match.line1   || "",
    line2:   address.line2   || match.line2   || "",
    city:    address.city    || match.city    || "",
    state:   address.state   || match.state   || "",
    zipCode: address.zipCode || match.zipCode || "",
    country: address.country || match.country || "India",
  };
};

const ShippingInfo = ({ address }) => {
  if (!address) {
    return <p className="shipping-info__line">No address on file.</p>;
  }

  // Enrich sparse backend address with localStorage saved address
  const enriched = enrichWithLocalStorage(address);

  // City, State - Pincode  (omit any missing segment cleanly)
  const cityPart    = enriched.city    || "";
  const statePart   = enriched.state   || "";
  const pincodePart = enriched.zipCode || "";

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
    enriched.name  || enriched.phone ||
    enriched.line1 || enriched.line2 ||
    cityLine       || enriched.country;

  if (!hasAnyContent) {
    return <p className="shipping-info__line">No address on file.</p>;
  }

  return (
    <div className="shipping-info">
      {enriched.name    && <p className="shipping-info__name">{enriched.name}</p>}
      {enriched.phone   && <p className="shipping-info__phone">📞 {enriched.phone}</p>}
      {enriched.line1   && <p className="shipping-info__line">{enriched.line1}</p>}
      {enriched.line2   && <p className="shipping-info__line">{enriched.line2}</p>}
      {cityLine         && <p className="shipping-info__line">{cityLine}</p>}
      {enriched.country && <p className="shipping-info__line">{enriched.country}</p>}
    </div>
  );
};

export default ShippingInfo;
