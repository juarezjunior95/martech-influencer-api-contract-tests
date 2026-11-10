import { FilterConfig } from '../types';

export const segmentsFilterConfig: FilterConfig = {
  key: 'segments',
  order: 36,
  isCommon: false,

  calculator: (filterData) => {
    return filterData.segments?.default?.value ?? 'beer';
  },

  validator: (filterData, value) => {
    const options = filterData.segments?.values || [];
    return options.some((opt) => opt.value === value);
  },

  dependencies: [],

  metadata: {
    displayName: 'Segments',
    description: 'Segments filter',
  },
};
