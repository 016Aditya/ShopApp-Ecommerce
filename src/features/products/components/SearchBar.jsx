import { useState } from "react";
import Button from "@/components/common/Button";

/**
 * SearchBar
 *
 * The search input uses data-search-bar="true" so that the global
 * dark-mode input override in index.css is excluded via the
 * input:not([data-search-bar]) selector.
 *
 * The search bar is ALWAYS light (#f8fafc bg, #111827 text, #64748b
 * placeholder) regardless of the active theme — this is intentional
 * for readability (Flipkart / Amazon search bar pattern).
 */
function SearchBar({ onSearch, placeholder = "Search products, brands and more..." }) {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch?.(keyword.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl p-4 shadow-sm md:flex-row md:items-end"
      style={{
        backgroundColor: "#f8fafc",
        border: "1px solid #cbd5e1",
      }}
    >
      <div className="flex-1 flex flex-col gap-1">
        <label
          htmlFor="product-search-input"
          className="text-sm font-medium"
          style={{ color: "#374151" }}
        >
          Search
        </label>
        {/* data-search-bar isolates this input from the global dark theme input override */}
        <input
          id="product-search-input"
          data-search-bar="true"
          type="text"
          name="search"
          placeholder={placeholder}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full rounded-lg px-4 py-2.5 text-sm outline-none"
          autoComplete="off"
        />
      </div>
      <Button type="submit" className="md:w-auto">
        Search
      </Button>
    </form>
  );
}

export default SearchBar;
