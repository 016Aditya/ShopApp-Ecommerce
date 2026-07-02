import { useDebounce } from '@/hooks/useDebounce';
import { useProductSuggestionsQuery } from '@/hooks/useQueryProducts';

export function useProductSuggestions(inputValue) {
  const debouncedQuery = useDebounce(inputValue, 300);
  return useProductSuggestionsQuery(debouncedQuery);
}
