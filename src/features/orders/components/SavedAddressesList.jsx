/**
 * SavedAddressesList — REMOVED
 *
 * This component previously rendered a localStorage-backed address list
 * inside the checkout flow.
 *
 * It has been replaced by:
 *   src/features/address/components/AddressList.jsx  (API-backed, MongoDB)
 *
 * This file is kept as an empty re-export to prevent broken imports during
 * the migration. Once all imports are updated, this file should be deleted.
 *
 * @deprecated — import AddressList from '@/features/address/components/AddressList' instead
 */
export { default } from '@/features/address/components/AddressList';
