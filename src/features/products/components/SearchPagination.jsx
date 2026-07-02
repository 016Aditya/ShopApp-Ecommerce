export default function SearchPagination({ currentPage, totalPages, hasNext, hasPrevious, onPageChange }) {
  const pages = [];
  const start = Math.max(0, currentPage - 2);
  const end = Math.min(totalPages - 1, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-2 py-6">
      <button disabled={!hasPrevious} onClick={() => onPageChange(currentPage - 1)}
        className="rounded px-3 py-1 text-sm disabled:opacity-40">Prev</button>
      {pages.map((p) => (
        <button key={p} onClick={() => onPageChange(p)}
          className={`rounded px-3 py-1 text-sm ${p === currentPage ? 'bg-blue-600 text-white' : ''}`}>
          {p + 1}
        </button>
      ))}
      <button disabled={!hasNext} onClick={() => onPageChange(currentPage + 1)}
        className="rounded px-3 py-1 text-sm disabled:opacity-40">Next</button>
    </div>
  );
}
