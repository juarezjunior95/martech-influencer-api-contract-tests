import { FilterConfig } from '../types';

export const productScopeFilterConfig: FilterConfig = {
  key: 'product_scope',
  order: 37,
  isCommon: false,
  calculator: (filterData) => {
    return filterData.product_scope?.default?.value ?? null;
  },
  validator: (filterData, value) => {
    const options = filterData.product_scope?.values || [];
    if (value === undefined || value === null || value === '') {
      return options.length > 0;
    }
    return options.some((opt) => opt.value === value);
  },
  dependencies: [],
  metadata: {
    displayName: 'Product Scope',
    description: 'Product Scope filter for Volume Pages',
  },
};
