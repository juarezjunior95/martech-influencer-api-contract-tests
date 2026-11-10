import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { FilterForm } from 'models/Filters';
import { selectPageApplied } from 'redux/slices/filters/selectors';

export const usePageFilterApplied = (pageName: string | null) => {
  const applied: FilterForm = useSelector(
    pageName ? selectPageApplied(pageName) : () => ({}),
  );

  const isGlobalZone = useMemo(() => {
    return applied?.zone === 'ABI';
  }, [applied?.zone]);

  return useMemo(() => ({ applied, isGlobalZone }), [applied, isGlobalZone]);
};
