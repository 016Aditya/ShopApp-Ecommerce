import { useEffect, useRef, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import { useProductSuggestionsQuery } from '@/hooks/useQueryProducts';

const SearchOverlayMobile = ({ initialValue = '', onClose, onSearch }) => {
  const [input, setInput] = useState(initialValue);
  const debounced = useDebounce(input, 300);
  const inputRef = useRef(null);

  // Fetch suggestions based on debounced input
  const { data: suggestions = [], isLoading } = useProductSuggestionsQuery(debounced);

  // Lock body scroll while the overlay is open and focus the input
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    // Small timeout ensures the DOM has painted before focusing
    setTimeout(() => inputRef.current?.focus(), 50);
    
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed) {
      onSearch(trimmed);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex flex-col" 
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Top Bar with Back Button and Input */}
      <div 
        className="flex items-center gap-3 border-b p-4 shadow-sm" 
        style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg-elevated)' }}
      >
        <button 
          onClick={onClose} 
          aria-label="Close search" 
          className="p-1 transition-opacity hover:opacity-70"
          style={{ color: 'var(--text-secondary)' }}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <form onSubmit={handleSubmit} className="relative flex-1">
          <input
            ref={inputRef}
            type="search"
            placeholder="Search for products..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-xl py-2 pl-4 pr-10 text-sm outline-none"
            style={{ 
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)', 
              border: '1px solid var(--border-color)' 
            }}
          />
          {input && (
             <button 
               type="button" 
               onClick={() => setInput('')} 
               className="absolute right-3 top-1/2 -translate-y-1/2"
               style={{ color: 'var(--text-secondary)' }}
             >
                ✕
             </button>
          )}
        </form>
      </div>

      {/* Results Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading && debounced.length >= 2 ? (
          <p className="text-center text-sm mt-4" style={{ color: 'var(--text-secondary)' }}>
            Loading...
          </p>
        ) : suggestions.length > 0 ? (
          <ul role="listbox" className="flex flex-col gap-2">
            {suggestions.map((item) => (
              <li
                key={item.id}
                role="option"
                onClick={() => {
                  onSearch(item.name);
                  onClose();
                }}
                className="flex cursor-pointer items-center gap-4 rounded-lg p-3 transition-colors"
                style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg-elevated)' }}
              >
                {item.imageUrl && (
                  <img src={item.imageUrl} alt="" className="h-12 w-12 rounded-md object-cover" />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {item.name}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {item.category}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : debounced.trim().length >= 2 ? (
          <p className="mt-4 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            No matches found for "{debounced}"
          </p>
        ) : (
          <p className="mt-10 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            Type at least 2 characters to search
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchOverlayMobile;