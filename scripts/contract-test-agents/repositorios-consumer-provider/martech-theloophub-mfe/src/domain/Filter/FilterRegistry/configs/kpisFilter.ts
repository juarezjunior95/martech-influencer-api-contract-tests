import { FilterConfig } from '../types';

export const kpisFilterConfig: FilterConfig = {
  key: 'kpis',
  order: 1,
  isCommon: true,
  isResettable: true,
  calculator: (filterData) => {
    return filterData.kpis?.default?.value ?? null;
  },
  validator: (filterData, value) => {
    const options = filterData.kpis?.values || [];
    return options.some((opt) => opt.value === value);
  },
  dependencies: [
    'country',
    'brands',
    'brand_filter_groupings',
    'portfolios',
    'beer_price_segment',
    'periods',
    'global_brands',
    'sub_brands',
  ],
  metadata: {
    displayName: 'KPIs',
    description: 'KPIs filter',
  },
};
