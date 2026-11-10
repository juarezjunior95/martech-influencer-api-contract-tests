import { FilterConfig } from '../types';

export const posPeriodsFilterConfig: FilterConfig = {
  key: 'pos_periods',
  order: 20,
  isCommon: true,
  calculator: (filterData) => {
    return filterData.pos_periods?.default?.value ?? null;
  },
  validator: (filterData, value) => {
    return filterData.pos_periods?.values?.some((opt) => opt?.value === value);
  },
  metadata: {
    displayName: 'POS Periods',
    description: 'POS periods filter',
  },
};
