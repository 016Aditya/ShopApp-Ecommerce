export default function SearchResultsMeta({ count, query, onClear }) {
  return (
    <div className="mb-3 flex items-center gap-2 text-sm">
      <span>{count} result{count !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;</span>
      <button onClick={onClear} className="ml-auto text-xs font-medium hover:underline">Clear ×</button>
    </div>
  );
}
