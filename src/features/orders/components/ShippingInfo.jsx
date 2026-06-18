const ShippingInfo = ({ address }) => {
  if (!address) {
    return <p className="shipping-info__line">No address on file.</p>;
  }

  return (
    <div className="shipping-info">
      {address.name && <p className="shipping-info__name">{address.name}</p>}
      {address.phone && <p className="shipping-info__phone">Phone: {address.phone}</p>}
      {address.email && <p className="shipping-info__line">{address.email}</p>}
      {address.line1 && <p className="shipping-info__line">{address.line1}</p>}
      {address.line2 && <p className="shipping-info__line">{address.line2}</p>}
      <p className="shipping-info__line">
        {[address.city, address.state, address.zipCode].filter(Boolean).join(", ") || "Address details unavailable"}
      </p>
      {address.country && <p className="shipping-info__line">{address.country}</p>}
    </div>
  );
};

export default ShippingInfo;
