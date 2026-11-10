import { FilterConfig } from '../types';

export const portfoliosFilterConfig: FilterConfig = {
  key: 'portfolios',
  order: 40,
  isCommon: true,
  parentKey: 'brand_filter_groupings',
  calculator: (filterData) => {
    return filterData.portfolios?.default?.value ?? null;
  },
  dependentDefaultCascadingCalculator: (filterData, currentValues) => {
    return currentValues.brand_filter_groupings === 'Portfolio' ? 'All' : null;
  },
  validator: (filterData, value) => {
    const options = filterData.portfolios?.values || [];
    return options.some((opt) => opt.value === value);
  },
  dependencies: ['brands', 'sub_brands'],
  metadata: {
    displayName: 'Portfolios',
    description: 'Portfolios filter',
  },
};
