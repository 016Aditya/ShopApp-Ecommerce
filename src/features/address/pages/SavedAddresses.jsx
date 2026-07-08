import { useState }            from 'react';
import { useNavigate }         from 'react-router-dom';
import PATHS                   from '@/routes/paths';
import { useAddresses }        from '../hooks/useAddresses';
import { useCreateAddress }    from '../hooks/useCreateAddress';
import { useUpdateAddress }    from '../hooks/useUpdateAddress';
import AddressList             from '../components/AddressList';
import AddressForm             from '../components/AddressForm';

/**
 * SavedAddresses  —  /profile/addresses
 *
 * Replaces the previous implementation that read / wrote addresses from
 * localStorage. All data now lives in MongoDB and flows through TanStack
 * Query hooks backed by the Address REST API.
 */
const SavedAddresses = () => {
  const navigate = useNavigate();

  const { data: addresses = [], isLoading } = useAddresses();
  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();

  const [showForm,   setShowForm]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);   // null → create mode
  const [successMsg, setSuccessMsg] = useState('');

  const flash = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const openAdd  = () => { setEditTarget(null); setShowForm(true); };
  const openEdit = (addr) => { setEditTarget(addr); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditTarget(null); };

  const handleSubmit = (formData) => {
    if (editTarget) {
      updateMutation.mutate(
        { id: editTarget.id, formData },
        {
          onSuccess: () => { closeForm(); flash('Address updated.'); },
          onError:   () => flash('Failed to update address.'),
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => { closeForm(); flash('Address saved.'); },
        onError:   () => flash('Failed to save address.'),
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container-app py-8">

        {/* Back */}
        <button
          type="button"
          className="mb-5 flex items-center gap-1.5 text-sm font-medium hover:underline transition"
          style={{ color: 'var(--accent)' }}
          onClick={() => navigate(PATHS.PROFILE)}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to My Account
        </button>

        {/* Card */}
        <div
          className="rounded-lg shadow-sm overflow-hidden"
          style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
        >
          {/* Header */}
          <div
            className="px-6 py-4"
            style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="flex items-center justify-center h-8 w-8 rounded-full text-white"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <div>
                  <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Saved Addresses</h1>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Manage your delivery locations</p>
                </div>
              </div>

              {!showForm && (
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition"
                  style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  onClick={openAdd}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Address
                </button>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="p-6">

            {successMsg && (
              <div
                className="mb-4 rounded-lg px-4 py-3 text-sm font-medium"
                style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#16a34a' }}
              >
                ✓ {successMsg}
              </div>
            )}

            {/* Inline form */}
            {showForm && (
              <div
                className="mb-6 rounded-xl p-5"
                style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
              >
                <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                  {editTarget ? '✏️ Edit Address' : 'Add New Address'}
                </h2>
                <AddressForm
                  initialData={editTarget}
                  onSubmit={handleSubmit}
                  onCancel={closeForm}
                  isPending={isPending}
                  submitLabel={editTarget ? 'Update Address' : 'Save Address'}
                />
              </div>
            )}

            {/* Address list */}
            {!showForm && (
              <>
                {!isLoading && (
                  <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                    {addresses.length > 0
                      ? `${addresses.length} saved address${addresses.length > 1 ? 'es' : ''}`
                      : 'No addresses saved yet'}
                  </p>
                )}

                <AddressList
                  addresses={addresses}
                  loading={isLoading}
                  onEdit={openEdit}
                />

                {!isLoading && (
                  <button
                    type="button"
                    className="mt-4 w-full border-2 border-dashed py-3 rounded-lg text-sm font-semibold transition"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--text-secondary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
                    onClick={openAdd}
                  >
                    + {addresses.length === 0 ? 'Add Your First Address' : 'Add New Address'}
                  </button>
                )}
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default SavedAddresses;
