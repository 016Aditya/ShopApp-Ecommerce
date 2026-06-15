import { useState } from "react";

const SavedAddressesList = ({ addresses, selectedId, onSelect, onEdit, onDelete, loading }) => {
  const [expandedId, setExpandedId] = useState(null);

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="text-center py-6 text-gray-600">
        <p>No saved addresses yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {addresses.map((address) => (
        <div
          key={address.id}
          className={`p-4 border-2 rounded-lg cursor-pointer transition ${
            selectedId === address.id
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => onSelect(address)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="radio"
                  name="address"
                  checked={selectedId === address.id}
                  onChange={() => onSelect(address)}
                  className="w-4 h-4 cursor-pointer"
                />
                <h3 className="font-semibold text-gray-900">{address.name}</h3>
              </div>

              {expandedId === address.id && (
                <div className="ml-7 text-sm text-gray-600 space-y-1">
                  <p>{address.line1}</p>
                  {address.line2 && <p>{address.line2}</p>}
                  <p>
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  {address.country && <p>{address.country}</p>}
                  <p className="text-gray-700 font-medium mt-2">Phone: {address.phone}</p>
                  {address.email && <p className="text-gray-700 font-medium">Email: {address.email}</p>}
                </div>
              )}

              {expandedId !== address.id && (
                <p className="ml-7 text-sm text-gray-600 line-clamp-2">
                  {address.line1}, {address.city}, {address.state} {address.zipCode}
                </p>
              )}
            </div>

            <div className="flex gap-2 ml-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedId(expandedId === address.id ? null : address.id);
                }}
                className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-100 rounded transition"
              >
                {expandedId === address.id ? "Hide" : "View"}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(address);
                }}
                className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-100 rounded transition"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Delete this address?")) {
                    onDelete(address.id);
                  }
                }}
                className="px-3 py-1 text-sm text-red-600 hover:bg-red-100 rounded transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedAddressesList;
