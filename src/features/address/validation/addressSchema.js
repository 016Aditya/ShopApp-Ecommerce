import * as yup from 'yup';

/**
 * addressSchema
 *
 * Mirrors the Bean Validation annotations on AddressRequest.java.
 * Keeping both in sync ensures the same rules fire on the client
 * (instant feedback) and the server (authoritative rejection).
 */
export const addressSchema = yup.object({
  name: yup
    .string()
    .required('Full name is required')
    .max(100, 'Name must be 100 characters or less'),

  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[+]?[0-9]{7,15}$/, 'Invalid phone number'),

  line1: yup
    .string()
    .required('Address is required')
    .max(200, 'Address must be 200 characters or less'),

  line2: yup
    .string()
    .max(200, 'Apartment/floor must be 200 characters or less'),

  city: yup
    .string()
    .required('City is required'),

  state: yup
    .string()
    .required('State is required'),

  zipCode: yup
    .string()
    .required('Zip code is required')
    .matches(/^[A-Za-z0-9 \-]{3,10}$/, 'Invalid zip code'),

  country: yup.string(),

  defaultAddress: yup.boolean(),
});
