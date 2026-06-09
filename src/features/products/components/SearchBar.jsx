import { useState } from "react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

function SearchBar({ onSearch, placeholder = "Search products..." }) {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch?.(keyword.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-end"
    >
      <div className="flex-1">
        <Input
          label="Search"
          name="search"
          placeholder={placeholder}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <Button type="submit" className="md:w-auto">
        Search
      </Button>
    </form>
  );
}

export default SearchBar;