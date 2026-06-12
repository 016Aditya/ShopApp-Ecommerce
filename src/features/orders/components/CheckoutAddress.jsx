import { useState } from "react";

const FIELDS = [
  { key: "name",    label: "Full Name",  type: "text",  required: true },
  { key: "email",   label: "Email",      type: "email", required: false },
  { key: "phone",   label: "Phone",      type: "tel",   required: true },
  { key: "line1",   label: "Address",    type: "text",  required: true },
  { key: "city",    label: "City",       type: "text",  required: true },
  { key: "state",   label: "State",      type: "text",  required: true },
  { key: "zipCode", label: "Pincode",    type: "text",  required: true },
  { key: "country", label: "Country",    type: "text",  required: false },
];

export const EMPTY_ADDRESS = {
  name: "", email: "", phone: "",
  line1: "", city: "", state: "",
  zipCode: "", country: "India",
};

const CheckoutAddress = ({ address, onChange }) => {
  const [errors, setErrors] = useState({});

  const validate = (key, value) => {
    if (FIELDS.find((f) => f.key === key)?.required && !value.trim()) {
      setErrors((prev) => ({ ...prev, [key]: "This field is required" }));
    } else {
      setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
    }
  };

  const handleChange = (key, value) => {
    validate(key, value);
    onChange({ ...address, [key]: value });
  };

  return (
    <div className="checkout-address">
      <div className="checkout-section__header">
        <span className="checkout-section__num">1</span>
        <h2 className="checkout-section__title">Delivery Address</h2>
      </div>
      <div className="checkout-address__grid">
        {FIELDS.map(({ key, label, type, required }) => (
          <div
            key={key}
            className={`form-group${key === "line1" ? " form-group--full" : ""}`}
          >
            <label htmlFor={`addr-${key}`} className="form-label">
              {label}
              {required && <span className="form-required"> *</span>}
            </label>
            <input
              id={`addr-${key}`}
              type={type}
              className={`input${errors[key] ? " input--error" : ""}`}
              value={address[key] ?? ""}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder={label}
            />
            {errors[key] && <span className="form-error">{errors[key]}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutAddress;
