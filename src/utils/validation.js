// ─── Field-level validators ───────────────────────────────────────────────────
// Each function returns null (valid) or an error string (invalid).
// Matches field names your backend DTOs expect.

// ── Auth ──────────────────────────────────────────────────────────────────────

export function validateFirstName(value) {
  if (!value?.trim()) return "First name is required";
  if (value.trim().length < 2) return "First name must be at least 2 characters";
  if (value.trim().length > 50) return "First name must be under 50 characters";
  return null;
}

export function validateLastName(value) {
  if (!value?.trim()) return "Last name is required";
  if (value.trim().length < 2) return "Last name must be at least 2 characters";
  if (value.trim().length > 50) return "Last name must be under 50 characters";
  return null;
}

export function validateEmail(value) {
  if (!value?.trim()) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value.trim())) return "Enter a valid email address";
  return null;
}

export function validatePassword(value) {
  if (!value) return "Password is required";
  if (value.length < 6) return "Password must be at least 6 characters";
  if (value.length > 100) return "Password must be under 100 characters";
  return null;
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return null;
}

// ── Product ───────────────────────────────────────────────────────────────────

export function validateProductName(value) {
  if (!value?.trim()) return "Product name is required";
  if (value.trim().length < 2) return "Name must be at least 2 characters";
  if (value.trim().length > 100) return "Name must be under 100 characters";
  return null;
}

export function validateProductCategory(value) {
  if (!value?.trim()) return "Category is required";
  return null;
}

export function validateProductPrice(value) {
  const price = Number(value);
  if (value === "" || value === null || value === undefined) return "Price is required";
  if (isNaN(price)) return "Price must be a number";
  if (price <= 0) return "Price must be greater than 0";
  if (price > 1_000_000) return "Price seems too high";
  return null;
}

// ── Cart ──────────────────────────────────────────────────────────────────────

export function validateCartQuantity(value) {
  const qty = Number(value);
  if (!Number.isInteger(qty)) return "Quantity must be a whole number";
  if (qty < 1) return "Quantity must be at least 1";
  if (qty > 99) return "Maximum quantity is 99";
  return null;
}

// ── Order ─────────────────────────────────────────────────────────────────────

export function validateAddressLine(value) {
  if (!value?.trim()) return "Address line is required";
  return null;
}

export function validateCity(value) {
  if (!value?.trim()) return "City is required";
  return null;
}

export function validateState(value) {
  if (!value?.trim()) return "State is required";
  return null;
}

export function validateZip(value) {
  if (!value?.trim()) return "ZIP code is required";
  const zipRegex = /^[0-9]{4,10}$/;
  if (!zipRegex.test(value.trim())) return "Enter a valid ZIP code";
  return null;
}

export function validateCountry(value) {
  if (!value?.trim()) return "Country is required";
  return null;
}

// ── Review ────────────────────────────────────────────────────────────────────

export function validateRating(value) {
  const rating = Number(value);
  if (!value && value !== 0) return "Rating is required";
  if (!Number.isInteger(rating)) return "Rating must be a whole number";
  if (rating < 1 || rating > 5) return "Rating must be between 1 and 5";
  return null;
}

export function validateComment(value) {
  if (!value?.trim()) return "Comment is required";
  if (value.trim().length < 5) return "Comment must be at least 5 characters";
  if (value.trim().length > 1000) return "Comment must be under 1000 characters";
  return null;
}

// ─── Form-level validators (validate the whole form object at once) ────────────

export function validateRegisterForm(fields) {
  return {
    firstName: validateFirstName(fields.firstName),
    lastName: validateLastName(fields.lastName),
    email: validateEmail(fields.email),
    password: validatePassword(fields.password),
    confirmPassword: validateConfirmPassword(fields.password, fields.confirmPassword),
  };
}

export function validateLoginForm(fields) {
  return {
    email: validateEmail(fields.email),
    password: validatePassword(fields.password),
  };
}

export function validateAddressForm(fields) {
  return {
    line1: validateAddressLine(fields.line1),
    city: validateCity(fields.city),
    state: validateState(fields.state),
    zip: validateZip(fields.zip),
    country: validateCountry(fields.country),
  };
}

export function validateReviewForm(fields) {
  return {
    rating: validateRating(fields.rating),
    comment: validateComment(fields.comment),
  };
}

/**
 * Returns true if a validation errors object has no errors.
 * Use this to check if a form is ready to submit.
 *
 * const errors = validateLoginForm(fields);
 * if (isFormValid(errors)) { ... }
 */
export function isFormValid(errors) {
  return Object.values(errors).every((error) => error === null);
}