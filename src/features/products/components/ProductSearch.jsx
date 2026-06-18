import { useEffect, useRef, useState } from "react";
import useDebounce from "@/hooks/useDebounce";

/**
 * ProductSearch
 *
 * Loop-safe design — three rules that together eliminate every redirect loop:
 *
 * 1. onSearch / onClear are stored in refs so a new function reference from
 *    the parent never re-triggers the search effect.
 *
 * 2. mountedRef guard — the search useEffect always fires once synchronously
 *    on mount (React double-invokes effects in StrictMode).  Without the
 *    guard, when ProductsPage remounts this component via key={activeSearch}
 *    the debounced value starts as "" → trimmed === "" → onClear() fires →
 *    handleClearSearch() → setSearchParams({}) wipes every URL param
 *    including ?category= and ?subcategory=.  The guard skips that first
 *    invocation entirely.
 *
 * 3. The initialValue sync useEffect is removed.  The parent passes
 *    key={activeSearch} so React remounts cleanly whenever the search param
 *    changes from outside (category click, Clear button, direct URL edit).
 *    No internal state sync = no secondary loop.
 */
const ProductSearch = ({ onSearch, onClear, initialValue = "" }) => {
  const [input, setInput] = useState(initialValue);
  const debounced = useDebounce(input, 400);

  // Store callbacks in refs so they never appear in useEffect dep arrays.
  const onSearchRef = useRef(onSearch);
  const onClearRef  = useRef(onClear);
  useEffect(() => { onSearchRef.current = onSearch; }, [onSearch]);
  useEffect(() => { onClearRef.current  = onClear;  }, [onClear]);

  // mountedRef — true after the first effect run; skips the mount-time fire.
  const mountedRef = useRef(false);

  useEffect(() => {
    // Skip the very first invocation so mounting / key-remounting never
    // dispatches a navigation action — only genuine user input does.
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    const trimmed = debounced.trim();
    if (trimmed) {
      onSearchRef.current(trimmed);
    } else {
      onClearRef.current();
    }
  }, [debounced]); // ← debounced is the only real trigger

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
