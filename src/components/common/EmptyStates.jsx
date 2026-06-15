const EmptyStateCart = ({ onContinueShopping }) => (
  <div className="text-center py-16">
    <div className="mb-6 flex justify-center">
      <svg className="h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    </div>
    <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
    <p className="text-gray-600 mb-8">Add some products to get started shopping!</p>
    <button
      onClick={onContinueShopping}
      className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition"
    >
      Continue Shopping
    </button>
  </div>
);

const EmptyStateOrders = ({ onStartShopping }) => (
  <div className="text-center py-16">
    <div className="mb-6 flex justify-center">
      <svg className="h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <h2 className="text-3xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
    <p className="text-gray-600 mb-8">You haven't placed any orders yet. Start shopping now!</p>
    <button
      onClick={onStartShopping}
      className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition"
    >
      Start Shopping
    </button>
  </div>
);

const EmptyStateSearch = ({ query, onClear }) => (
  <div className="text-center py-16">
    <div className="mb-6 flex justify-center">
      <svg className="h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <h2 className="text-3xl font-bold text-gray-900 mb-2">No Results Found</h2>
    <p className="text-gray-600 mb-2">We couldn't find any products matching "{query}"</p>
    <p className="text-gray-600 mb-8">Try adjusting your search or filters</p>
    <button
      onClick={onClear}
      className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
    >
      Clear Search
    </button>
  </div>
);

const EmptyStateAddresses = ({ onAdd }) => (
  <div className="text-center py-8">
    <div className="mb-4 flex justify-center">
      <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      </svg>
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">No Saved Addresses</h3>
    <p className="text-gray-600 mb-4">Add your first address to get started</p>
    <button
      onClick={onAdd}
      className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
    >
      Add Address
    </button>
  </div>
);

export { EmptyStateCart, EmptyStateOrders, EmptyStateSearch, EmptyStateAddresses };
