export default function EmptySearchState({ query, onClear }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <p className="text-sm text-gray-600">No results found for &ldquo;{query}&rdquo;</p>
      <button onClick={onClear} className="text-sm font-medium text-blue-600 hover:underline">
        Clear search
      </button>
    </div>
  );
}
