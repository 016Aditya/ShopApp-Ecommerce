import { useState } from "react";
import { useSavedAddresses } from "../hooks/useSavedAddresses";
import SavedAddressesList from "./SavedAddressesList";

const FIELDS = [
  { key: "name",    label: "Full Name",  type: "text",  required: true },
  { key: "email",   label: "Email",      type: "email", required: false },
  { key: "phone",   label: "Phone",      type: "tel",   required: true },
  { key: "line1",   label: "Address",    type: "text",  required: true },
  { key: "line2",   label: "Apt/Floor (Optional)",    type: "text",  required: false },
  { key: "city",    label: "City",       type: "text",  required: true },
  { key: "state",   label: "State",      type: "text",  required: true },
  { key: "zipCode", label: "Pincode",    type: "text",  required: true },
  { key: "country", label: "Country",    type: "text",  required: false },
];

export const EMPTY_ADDRESS = {
  name: "", email: "", phone: "",
  line1: "", line2: "", city: "", state: "",
  zipCode: "", country: "India",
};

const CheckoutAddress = ({ address, onChange }) => {
  const [errors, setErrors] = useState({});
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [saveThisAddress, setSaveThisAddress] = useState(false);
  const { addresses, saveAddress, updateAddress, deleteAddress, loading } = useSavedAddresses();

  const validate = (key, value) => {
    const field = FIELDS.find((f) => f.key === key);
    if (field?.required && !value.trim()) {
      setErrors((prev) => ({ ...prev, [key]: "This field is required" }));
    } else {
      setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
    }
  };

  const handleChange = (key, value) => {
    validate(key, value);
    onChange({ ...address, [key]: value });
  };

  const handleSelectSavedAddress = (selectedAddress) => {
    const { id, createdAt, ...addressData } = selectedAddress;
    onChange(addressData);
    setShowNewAddress(false);
  };

  const handleSaveCurrentAddress = () => {
    const { id, createdAt, ...addressToSave } = address;
    saveAddress(addressToSave);
    setSaveThisAddress(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white font-bold text-sm">
            1
          </span>
          <h2 className="text-lg font-bold text-gray-900">Delivery Address</h2>
        </div>
      </div>

      <div className="p-6">
        {/* Saved Addresses Section */}
        {!showNewAddress && addresses.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Saved Addresses</h3>
            <SavedAddressesList
              addresses={addresses}
              selectedId={address.id}
              onSelect={handleSelectSavedAddress}
              onEdit={() => setShowNewAddress(true)}
              onDelete={deleteAddress}
              loading={loading}
            />
            <button
              onClick={() => {
                setShowNewAddress(true);
                setSaveThisAddress(false);
              }}
              className="mt-4 w-full border-2 border-dashed border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 rounded-lg transition"
            >
              + Add New Address
            </button>
          </div>
        )}

        {/* Address Form */}
        {(showNewAddress || addresses.length === 0) && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {FIELDS.map(({ key, label, type, required }) => (
                <div
                  key={key}
                  className={key === "line1" || key === "line2" ? "md:col-span-2" : ""}
                >
                  <label htmlFor={`addr-${key}`} className="block text-sm font-medium text-gray-900 mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <input
                    id={`addr-${key}`}
                    type={type}
                    className={`w-full px-4 py-2 border rounded-lg outline-none transition ${
                      errors[key]
                        ? "border-red-500 focus:ring-2 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                    value={address[key] ?? ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder={label}
                  />
                  {errors[key] && (
                    <p className="text-red-600 text-sm mt-1">{errors[key]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Save Address Checkbox */}
            <div className="mb-6 flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <input
                type="checkbox"
                id="save-address"
                checked={saveThisAddress}
                onChange={(e) => setSaveThisAddress(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded cursor-pointer mt-0.5"
              />
              <label htmlFor="save-address" className="flex-1 cursor-pointer">
                <p className="font-medium text-gray-900">Save this address for future use</p>
                <p className="text-sm text-gray-600">You can edit or delete this address anytime</p>
              </label>
            </div>

            {saveThisAddress && (
              <button
                onClick={handleSaveCurrentAddress}
                className="mb-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
              >
                ✓ Save Address
              </button>
            )}

            {addresses.length > 0 && (
              <button
                onClick={() => setShowNewAddress(false)}
                className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-2 rounded-lg transition"
              >
                Back to Saved Addresses
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutAddress;
