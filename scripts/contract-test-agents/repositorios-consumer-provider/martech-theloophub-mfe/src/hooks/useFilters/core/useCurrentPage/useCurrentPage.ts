import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { PageName } from 'models/Filters';
import { selectCurrentPage } from 'redux/slices/filters/selectors';

export const useCurrentPage = () => {
  const currentPage: PageName = useSelector(selectCurrentPage);
  return useMemo(() => ({ currentPage }), [currentPage]);
};
