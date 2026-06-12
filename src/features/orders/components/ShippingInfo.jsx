const ShippingInfo = ({ address }) => {
  if (!address)
    return <p className="text-muted">No address on file.</p>;

  return (
    <div className="shipping-info">
      {address.name  && <p className="shipping-info__name">{address.name}</p>}
      {address.phone && <p className="shipping-info__phone">📞 {address.phone}</p>}
      <p className="shipping-info__line">{address.line1}</p>
      <p className="shipping-info__line">
        {[address.city, address.state, address.zipCode].filter(Boolean).join(", ")}
      </p>
      {address.country && <p className="shipping-info__line">{address.country}</p>}
    </div>
  );
};

export default ShippingInfo;
