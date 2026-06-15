export const CartItemSkeleton = () => (
  <div className="flex gap-4 border-b border-gray-200 py-4 sm:gap-6 sm:py-6 animate-pulse">
    <div className="flex-shrink-0 h-24 w-24 sm:h-32 sm:w-32 bg-gray-200 rounded" />
    <div className="flex-1 space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-6 bg-gray-200 rounded w-1/3" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  </div>
);

export const ProductCardSkeleton = () => (
  <div className="flex flex-col rounded-sm border border-slate-100 bg-white shadow-sm animate-pulse">
    <div className="flex h-44 items-center justify-center bg-slate-200 overflow-hidden" />
    <div className="flex flex-1 flex-col gap-2 p-3">
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="h-4 bg-slate-200 rounded w-1/2" />
      <div className="h-6 bg-slate-200 rounded w-1/3" />
      <div className="h-4 bg-slate-200 rounded w-full mt-2" />
      <div className="h-10 bg-slate-200 rounded w-full mt-auto" />
    </div>
  </div>
);

export const OrderSummarySkeleton = () => (
  <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-1/2 mb-6" />
    <div className="space-y-4 mb-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
      ))}
    </div>
    <div className="space-y-2">
      <div className="h-10 bg-gray-200 rounded w-full" />
      <div className="h-10 bg-gray-200 rounded w-full" />
    </div>
  </div>
);

export const CheckoutAddressSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm animate-pulse">
    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <div className="h-6 bg-gray-200 rounded w-1/3" />
    </div>
    <div className="p-6 space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      ))}
      <div className="h-20 bg-gray-200 rounded" />
    </div>
  </div>
);
