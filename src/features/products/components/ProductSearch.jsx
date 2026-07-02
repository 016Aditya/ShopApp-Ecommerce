import { useState, useRef, useEffect } from 'react';
import { useIsMobileSearch } from '../hooks/useIsMobileSearch';
import { useProductSuggestions } from '../hooks/useProductSuggestions';
import SearchSuggestions from './SearchSuggestions';
import SearchOverlayMobile from './SearchOverlayMobile';

export default function ProductSearch({ onSearch, onClear, initialValue = '' }) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const isMobile = useIsMobileSearch();
  const { data: suggestions = [] } = useProductSuggestions(inputValue);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const commitSearch = (term) => {
    setInputValue(term);
    setIsOpen(false);
    onSearch(term);
  };

  const handleKeyDown = (e) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) setIsOpen(true);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = activeIndex >= 0 ? suggestions[activeIndex]?.name : inputValue;
      if (selected) commitSearch(selected);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  if (isMobile) {
    return (
      <SearchOverlayMobile
        inputValue={inputValue}
        setInputValue={setInputValue}
        suggestions={suggestions}
        activeIndex={activeIndex}
        onSelect={commitSearch}
        onClear={onClear}
      />
    );
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="search-suggestions"
        aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
        aria-autocomplete="list"
        value={inputValue}
        placeholder="Search products..."
        className="w-full rounded-md border px-3 py-2 text-sm"
        onChange={(e) => {
          setInputValue(e.target.value);
          setIsOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
      />
      {isOpen && (
        <SearchSuggestions
          suggestions={suggestions}
          activeIndex={activeIndex}
          onSelect={commitSearch}
          onMouseEnterItem={setActiveIndex}
        />
      )}
    </div>
  );
}
