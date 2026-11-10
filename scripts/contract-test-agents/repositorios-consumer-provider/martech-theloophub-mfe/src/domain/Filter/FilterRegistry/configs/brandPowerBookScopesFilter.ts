import { FilterConfig } from '../types';

export const brandPowerBookScopesFilterConfig: FilterConfig = {
  key: 'scopes',
  order: 80,
  isCommon: true,
  calculator: (filterData) => {
    return filterData.brand_power_book_scopes?.default?.value ?? null;
  },
  validator: (filterData, value) => {
    if (!value) return false;

    const scopesData = filterData.brand_power_book_scopes?.values || [];

    return Object.values(scopesData).some((scope) => scope.value === value);
  },
  dependencies: ['sub_scopes'],
  metadata: {
    displayName: 'Brand Power Book Scopes',
    description: 'Scopes for brand power book',
  },
};
