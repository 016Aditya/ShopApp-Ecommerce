export default function SearchPagination({ currentPage, totalPages, hasNext, hasPrevious, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(0, currentPage - 2);
  const end = Math.min(totalPages - 1, start + 4);

  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-2 py-2">
      <button
        type="button"
        disabled={!hasPrevious}
        onClick={() => onPageChange(Math.max(currentPage - 1, 0))}
        className="rounded-full px-4 py-2 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        style={{
          backgroundColor: 'var(--card-bg-elevated)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className="rounded-full px-4 py-2 text-sm font-medium transition-opacity"
          style={{
            backgroundColor: page === currentPage ? 'var(--text-primary)' : 'var(--card-bg-elevated)',
            border: '1px solid var(--border-color)',
            color: page === currentPage ? 'var(--bg-primary)' : 'var(--text-primary)',
          }}
        >
          {page + 1}
        </button>
      ))}

      <button
        type="button"
        disabled={!hasNext}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-full px-4 py-2 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        style={{
          backgroundColor: 'var(--card-bg-elevated)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        Next
      </button>
    </div>
  );
}
