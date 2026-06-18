import { useEffect, useRef, useState } from "react";
import useDebounce from "@/hooks/useDebounce";

/**
 * ProductSearch
 *
 * Loop-safe design:
 *
 * 1. onSearch / onClear are stored in refs — they are always up-to-date
 *    but NEVER appear in any useEffect dependency array.  This means a new
 *    function reference from the parent (even without useCallback) cannot
 *    re-trigger the search effect.
 *
 * 2. The initialValue sync useEffect is removed.  Instead, the parent
 *    passes key={activeSearch} so React remounts this component cleanly
 *    whenever the search param changes from outside (category click, Clear
 *    button, direct URL edit).  No internal state sync = no secondary loop.
 *
 * 3. The search useEffect depends only on [debounced] — the single value
 *    that should trigger a search dispatch.  It will only fire when the
 *    user's typed, debounced input actually changes.
 */
const ProductSearch = ({ onSearch, onClear, initialValue = "" }) => {
  const [input, setInput] = useState(initialValue);
  const debounced = useDebounce(input, 400);

  // Store callbacks in refs so they are always fresh without being deps.
  const onSearchRef = useRef(onSearch);
  const onClearRef  = useRef(onClear);
  useEffect(() => { onSearchRef.current = onSearch; }, [onSearch]);
  useEffect(() => { onClearRef.current  = onClear;  }, [onClear]);

  // Fire search only when the debounced value changes.
  // onSearch / onClear are accessed via ref — not listed as deps.
  useEffect(() => {
    const trimmed = debounced.trim();
    if (trimmed) {
      onSearchRef.current(trimmed);
    } else {
      onClearRef.current();
    }
  }, [debounced]); // ← only real trigger

  return (
    <div className="relative w-full sm:max-w-sm">
      <svg
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
        style={{ color: "var(--text-secondary)" }}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="search"
        data-search-bar="true"
        placeholder="Search products..."
        value={input}
        onChange={(event) => setInput(event.target.value)}
        aria-label="Search products"
        className="w-full rounded-xl py-2.5 pl-9 pr-4 text-sm shadow-sm outline-none transition"
      />
    </div>
  );
};

export default ProductSearch;
