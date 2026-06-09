import { useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { useEffect } from "react";

const ProductSearch = ({ onSearch, onClear }) => {
  const [input, setInput] = useState("");
  const debounced = useDebounce(input, 400);

  useEffect(() => {
    if (debounced.trim()) {
      onSearch(debounced.trim());
    } else {
      onClear();
    }
  }, [debounced]);

  return (
    <div className="product-search">
      <input
        type="search"
        placeholder="Search products..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        aria-label="Search products"
        className="input"
      />
    </div>
  );
};

export default ProductSearch;