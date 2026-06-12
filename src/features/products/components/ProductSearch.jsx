import { useState, useEffect } from "react";
import useDebounce from "@/hooks/useDebounce";

const ProductSearch = ({ onSearch, onClear }) => {
  const [input, setInput] = useState("");
  const debounced = useDebounce(input, 400);

  useEffect(() => {
    debounced.trim() ? onSearch(debounced.trim()) : onClear();
  }, [debounced]);

  return (
    <div className="relative w-full sm:max-w-sm">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="search"
        placeholder="Search products..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        aria-label="Search products"
        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
      />
    </div>
  );
};

export default ProductSearch;