import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { FilterForm } from 'models/Filters';
import { selectPageForm } from 'redux/slices/filters/selectors';

export const usePageFilterForm = (pageName: string | null) => {
  const form: FilterForm = useSelector(
    pageName ? selectPageForm(pageName) : () => ({}),
  ) as FilterForm;

  return useMemo(
    () => ({
      form,
    }),
    [form],
  );
};
