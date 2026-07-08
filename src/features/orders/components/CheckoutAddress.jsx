import { useState }         from 'react';
import { useAddresses }     from '@/features/address/hooks/useAddresses';
import { useCreateAddress } from '@/features/address/hooks/useCreateAddress';
import AddressList          from '@/features/address/components/AddressList';
import AddressForm          from '@/features/address/components/AddressForm';

/**
 * CheckoutAddress
 *
 * Step 1 of the checkout flow — Delivery Address.
 *
 * BEFORE: read/wrote addresses to localStorage via useSavedAddresses.
 * AFTER:  fetches saved addresses from GET /api/v1/addresses via useAddresses.
 *         User selects a saved address (passes addressId to parent)
 *         or adds a new one inline (POSTs then selects).
 *
 * Props:
 *   selectedAddressId  {string|null}  — controlled: the id currently selected
 *   onSelect           {function}     — called with addressId string when user picks one
 */
const CheckoutAddress = ({ selectedAddressId, onSelect }) => {
  const { data: addresses = [], isLoading } = useAddresses();
  const createMutation = useCreateAddress();

  const [showForm, setShowForm] = useState(false);
  const [error,    setError]    = useState('');

  // Auto-select default address on first load if nothing is selected yet
  // This runs on render; if addresses loaded and no selection exists, pick default.
  const defaultAddr = addresses.find((a) => a.defaultAddress) ?? addresses[0] ?? null;
  if (!selectedAddressId && defaultAddr && !showForm) {
    onSelect(defaultAddr.id);
  }

  const handleSelect = (addr) => {
    onSelect(addr.id);
    setShowForm(false);
    setError('');
  };

  const handleAddNew = (formData) => {
    setError('');
    createMutation.mutate(formData, {
      onSuccess: ({ data }) => {
        onSelect(data.id);
        setShowForm(false);
      },
      onError: () => setError('Failed to save address. Please try again.'),
    });
  };

  return (
    <div
      className="rounded-lg shadow-sm overflow-hidden"
      style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4"
        style={{
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white font-bold text-sm">
            1
          </span>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            Delivery Address
          </h2>
        </div>
      </div>

      <div className="p-6">

        {error && (
          <div
            className="mb-4 rounded-lg px-4 py-3 text-sm"
            style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#dc2626' }}
          >
            {error}
          </div>
        )}

        {/* ── Saved address list (select mode) ────────────────────────── */}
        {!showForm && (
          <>
            <AddressList
              addresses={addresses}
              loading={isLoading}
              selectable
              selectedId={selectedAddressId}
              onSelect={handleSelect}
            />

            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-4 w-full border-2 border-dashed font-semibold py-3 rounded-lg transition text-sm"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--text-secondary)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
            >
              + Add New Address
            </button>
          </>
        )}

        {/* ── Inline new address form ──────────────────────────────────── */}
        {showForm && (
          <div
            className="rounded-xl p-5"
            style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
          >
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Add New Address
            </h3>
            <AddressForm
              initialData={null}
              onSubmit={handleAddNew}
              onCancel={() => { setShowForm(false); setError(''); }}
              isPending={createMutation.isPending}
              submitLabel="Save & Select"
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default CheckoutAddress;
