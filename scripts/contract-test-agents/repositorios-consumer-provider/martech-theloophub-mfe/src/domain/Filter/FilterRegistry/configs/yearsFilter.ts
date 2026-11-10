import { FilterConfig } from '../types';

export const yearsFilterConfig: FilterConfig = {
  key: 'years',
  order: 21,
  isCommon: false,

  calculator: (filterData) => {
    const options = filterData.years?.values;
    if (!options?.length) {
      return null;
    }

    const rawDefault = filterData.years?.default?.value;
    if (
      rawDefault !== undefined &&
      rawDefault !== null &&
      rawDefault !== '' &&
      options.some((opt) => opt.value === rawDefault)
    ) {
      return rawDefault;
    }

    return options[0]?.value ?? null;
  },

  validator: (filterData, value) => {
    const options = filterData.years?.values;
    if (!options?.length) {
      return false;
    }

    return options.some((opt) => opt.value === value);
  },

  dependencies: [],

  metadata: {
    displayName: 'Years',
    description: 'Filter by year (FY)',
  },
};
