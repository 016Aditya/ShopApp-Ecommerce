/**
 * SavedAddressesPage (profile/pages) — REPLACED
 *
 * The full implementation has moved to:
 *   src/features/address/pages/SavedAddresses.jsx
 *
 * This re-export exists solely to avoid breaking any existing router
 * import of SavedAddressesPage during the migration window.
 * Once the router import is updated to point to the new path,
 * this file should be deleted.
 *
 * @deprecated — update router to: import SavedAddresses from '@/features/address/pages/SavedAddresses'
 */
export { default } from '@/features/address/pages/SavedAddresses';
