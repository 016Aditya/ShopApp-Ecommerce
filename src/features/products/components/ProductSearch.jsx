import { useIsMobileSearch } from '../hooks/useIsMobileSearch';
import SearchOverlayMobile from './SearchOverlayMobile';
import SearchInput from './SearchInput';

export default function ProductSearch({ onSearch, onClear, initialValue = '' }) {
  const isMobile = useIsMobileSearch();

  if (isMobile) {
    return <SearchOverlayMobile initialValue={initialValue} onSearch={onSearch} onClear={onClear} />;
  }

  return <SearchInput initialValue={initialValue} onSearch={onSearch} />;
}
