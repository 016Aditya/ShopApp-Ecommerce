import { useEffect, useRef } from 'react';

export default function SearchOverlayMobile({
  inputValue,
  setInputValue,
  suggestions,
  activeIndex,
  onSelect,
  onClear,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    function handleEsc(event) {
      if (event.key === 'Escape') onClear();
    }

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClear]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div
        className="flex items-center gap-3 border-b p-4 shadow-sm"
        style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg-elevated)' }}
      >
        <button
          type="button"
          onClick={onClear}
          aria-label="Back"
          className="p-1 text-lg transition-opacity hover:opacity-70"
          style={{ color: 'var(--text-secondary)' }}
        >
          &larr;
        </button>
        <input
          ref={inputRef}
          type="search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search products..."
          className="flex-1 rounded-xl px-4 py-2 text-sm outline-none"
          style={{
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {suggestions.length > 0 ? (
          <ul role="listbox" className="flex flex-col gap-2">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.id}
                role="option"
                aria-selected={activeIndex === index}
                className="flex cursor-pointer items-center gap-3 rounded-lg p-3"
                style={{
                  border: '1px solid var(--border-color)',
                  backgroundColor:
                    activeIndex === index ? 'var(--bg-secondary)' : 'var(--card-bg-elevated)',
                }}
                onClick={() => onSelect(suggestion.name)}
              >
                {suggestion.thumbnail && (
                  <img src={suggestion.thumbnail} alt="" className="h-10 w-10 rounded-md object-cover" />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {suggestion.name}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {suggestion.category}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-10 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            {inputValue.trim().length >= 2 ? 'No matching products found.' : 'Type at least 2 characters to search.'}
          </p>
        )}
      </div>
    </div>
  );
}
