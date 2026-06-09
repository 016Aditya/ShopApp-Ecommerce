const AddressForm = ({ address, onChange }) => {
  const handleChange = (e) => {
    onChange({ ...address, [e.target.name]: e.target.value });
  };

  return (
    <div className="address-form">
      <h3 className="address-form__title">Delivery Address</h3>

      <div className="form-group">
        <label htmlFor="line1">Address Line 1</label>
        <input
          id="line1" name="line1" type="text"
          className="input" placeholder="Street, House No."
          value={address.line1} onChange={handleChange} required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            id="city" name="city" type="text"
            className="input" placeholder="City"
            value={address.city} onChange={handleChange} required
          />
        </div>
        <div className="form-group">
          <label htmlFor="state">State</label>
          <input
            id="state" name="state" type="text"
            className="input" placeholder="State"
            value={address.state} onChange={handleChange} required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="zipCode">ZIP Code</label>
          <input
            id="zipCode" name="zipCode" type="text"
            className="input" placeholder="ZIP Code"
            value={address.zipCode} onChange={handleChange} required
          />
        </div>
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            id="country" name="country" type="text"
            className="input" placeholder="Country"
            value={address.country} onChange={handleChange} required
          />
        </div>
      </div>
    </div>
  );
};

export default AddressForm;