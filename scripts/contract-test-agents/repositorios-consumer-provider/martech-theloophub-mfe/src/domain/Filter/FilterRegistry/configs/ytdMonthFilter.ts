import { FilterConfig } from '../types';

export const ytdMonthFilterConfig: FilterConfig = {
  key: 'ytd-month',
  order: 20,
  isCommon: true,
  calculator: (filterData) => {
    return filterData['ytd-month']?.default?.value ?? null;
  },
  validator: (filterData, value) => {
    return filterData['ytd-month']?.values?.some((opt) => opt?.value === value);
  },
  metadata: {
    displayName: 'YTD Month',
    description: 'Year-to-date month filter',
  },
};
