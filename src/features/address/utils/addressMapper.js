/**
 * addressMapper.js
 *
 * Translates between backend AddressResponse / AddressRequest shapes
 * and the flat form shape used by AddressForm.jsx.
 *
 * Backend AddressResponse (AddressResponse.java):
 *   id, fullName, phoneNumber, addressLine1, addressLine2,
 *   city, state, zipCode, country, defaultAddress, createdAt, updatedAt
 *
 * Form shape (used by AddressForm):
 *   id, name, phone, line1, line2, city, state, zipCode, country, defaultAddress
 *
 * Backend AddressRequest (AddressRequest.java):
 *   fullName, phoneNumber, addressLine1, addressLine2,
 *   city, state, zipCode, country, defaultAddress
 */

export const EMPTY_FORM = {
  name:           '',
  phone:          '',
  line1:          '',
  line2:          '',
  city:           '',
  state:          '',
  zipCode:        '',
  country:        'India',
  defaultAddress: false,
};

/** Backend AddressResponse → form shape */
export const toFormShape = (addr = {}) => ({
  id:             addr.id             ?? null,
  name:           addr.fullName       ?? '',
  phone:          addr.phoneNumber    ?? '',
  line1:          addr.addressLine1   ?? '',
  line2:          addr.addressLine2   ?? '',
  city:           addr.city           ?? '',
  state:          addr.state          ?? '',
  zipCode:        addr.zipCode        ?? '',
  country:        addr.country        ?? 'India',
  defaultAddress: addr.defaultAddress ?? false,
  createdAt:      addr.createdAt      ?? null,
  updatedAt:      addr.updatedAt      ?? null,
});

/** Form shape → AddressRequest body (matches AddressRequest.java field names) */
export const toRequestBody = (form = {}) => ({
  fullName:       form.name           ?? '',
  phoneNumber:    form.phone          ?? '',
  addressLine1:   form.line1          ?? '',
  addressLine2:   form.line2          ?? '',
  city:           form.city           ?? '',
  state:          form.state          ?? '',
  zipCode:        form.zipCode        ?? '',   // zipCode — NOT postalCode
  country:        form.country        ?? 'India',
  defaultAddress: form.defaultAddress ?? false,
});
