import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useProductSearchParams() {
  const [params, setParams] = useSearchParams();

  const search = params.get('search') || '';
  const parsedPage = Number.parseInt(params.get('page') || '0', 10);
  const page = Number.isNaN(parsedPage) ? 0 : parsedPage;

  const setSearch = useCallback((term) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (term) {
        next.set('search', term);
        next.set('page', '0');
      } else {
        next.delete('search');
        next.delete('page');
      }
      return next;
    });
  }, [setParams]);

  const setPage = useCallback((n) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(n));
      return next;
    });
  }, [setParams]);

  return { search, page, setSearch, setPage };
}
