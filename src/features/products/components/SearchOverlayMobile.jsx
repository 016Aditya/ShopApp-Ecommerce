import { useEffect, useRef } from 'react';

export default function SearchOverlayMobile({ inputValue, setInputValue, suggestions, activeIndex, onSelect, onClear }) {
  const inputRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape') onClear();
    }
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClear]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="flex items-center gap-2 border-b p-3">
        <button onClick={onClear} aria-label="Back">←</button>
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search products..."
          className="flex-1 rounded-md border px-3 py-2 text-sm"
        />
      </div>
      <ul role="listbox" className="flex-1 overflow-y-auto">
        {suggestions.map((s, i) => (
          <li key={s.id} role="option" aria-selected={activeIndex === i}
            className="flex items-center gap-3 px-3 py-3 border-b"
            onClick={() => onSelect(s.name)}>
            {s.thumbnail && <img src={s.thumbnail} alt="" className="h-10 w-10 object-cover" />}
            <div className="flex flex-col">
              <span className="text-sm font-medium">{s.name}</span>
              <span className="text-xs text-gray-500">{s.category}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
