const SearchPagination = ({ currentPage, totalPages, hasNext, hasPrevious, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(currentPage - 1, 0))}
        disabled={!hasPrevious}
        className="rounded-full px-5 py-2 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          backgroundColor: 'var(--card-bg-elevated)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        Previous
      </button>
      
      <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
        Page {currentPage + 1} of {totalPages}
      </span>
      
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className="rounded-full px-5 py-2 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
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
};

export default SearchPagination;