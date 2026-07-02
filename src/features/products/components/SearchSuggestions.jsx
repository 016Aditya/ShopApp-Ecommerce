export default function SearchSuggestions({ suggestions = [], activeIndex, onSelect, onMouseEnterItem }) {
  if (!suggestions.length) return null;
  return (
    <ul role="listbox" id="search-suggestions" aria-label="Search suggestions"
      className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border bg-white shadow-lg">
      {suggestions.map((s, i) => (
        <li key={s.id} role="option" id={`suggestion-${i}`} aria-selected={activeIndex === i}
          className={`flex cursor-pointer items-center gap-3 px-3 py-2 ${activeIndex === i ? 'bg-gray-100' : 'bg-white'}`}
          onMouseEnter={() => onMouseEnterItem?.(i)} onClick={() => onSelect(s.name)}>
          {s.thumbnail && <img src={s.thumbnail} alt="" aria-hidden="true" className="h-10 w-10 object-cover" />}
          <div className="flex flex-col">
            <span className="text-sm font-medium">{s.name}</span>
            <span className="text-xs text-gray-500">{s.category}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
