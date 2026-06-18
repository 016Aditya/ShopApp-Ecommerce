import { useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";

const ProductSearch = ({ onSearch, onClear, initialValue = "" }) => {
  const [input, setInput] = useState(initialValue);
  const debounced = useDebounce(input, 400);

  useEffect(() => {
    setInput(initialValue);
  }, [initialValue]);

  useEffect(() => {
    debounced.trim() ? onSearch(debounced.trim()) : onClear();
  }, [debounced, onClear, onSearch]);

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
