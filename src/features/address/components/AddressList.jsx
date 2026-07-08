import AddressCard from './AddressCard';

/**
 * AddressList
 *
 * Renders a vertical stack of AddressCard components.
 *
 * Props:
 *   addresses  {array}    — form-shape address array from useAddresses()
 *   loading    {boolean}  — shows placeholder skeletons while true
 *   onEdit     {function} — forwarded to each AddressCard (Profile/manage mode)
 *   selectable {boolean}  — Checkout mode: renders radio selectors
 *   selectedId {string}   — id of the currently selected address in Checkout mode
 *   onSelect   {function} — forwarded to each AddressCard in Checkout mode
 */
const AddressList = ({
  addresses  = [],
  loading    = false,
  onEdit,
  selectable = false,
  selectedId = null,
  onSelect,
}) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl h-28 animate-pulse"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          />
        ))}
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <p className="text-sm text-center py-6" style={{ color: 'var(--text-secondary)' }}>
        No saved addresses yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {addresses.map((addr) => (
        <AddressCard
          key={addr.id}
          address={addr}
          onEdit={onEdit}
          selectable={selectable}
          selected={addr.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default AddressList;
