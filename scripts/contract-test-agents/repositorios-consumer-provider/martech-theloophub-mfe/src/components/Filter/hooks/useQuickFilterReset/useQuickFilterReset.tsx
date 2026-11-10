import { useCallback } from 'react';

import { getFiltersToReset } from 'components/Filter/utils/filterDependencies';
import { usePageFilterData, usePageFilterManagement } from 'hooks';

export const useQuickFilterReset = (pageName: string, fieldKey: string) => {
  const { defaults } = usePageFilterData(pageName);
  const { updateForm, apply } = usePageFilterManagement(pageName);

  const handleClear = useCallback(() => {
    const filtersToReset = getFiltersToReset(fieldKey);
    const zoneIndex = filtersToReset.indexOf('zone');
    if (zoneIndex > -1) {
      updateForm('zone', defaults?.['zone']);
    }

    filtersToReset
      .filter((key) => key !== 'zone')
      .forEach((key) => {
        const defaultValue = defaults?.[key];
        updateForm(key, defaultValue);
      });

    apply();
  }, [fieldKey, defaults, updateForm, apply]);

  return { handleClear };
};
