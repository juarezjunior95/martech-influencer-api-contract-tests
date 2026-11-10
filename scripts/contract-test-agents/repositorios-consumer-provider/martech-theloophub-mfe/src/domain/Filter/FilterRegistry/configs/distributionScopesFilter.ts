import { FilterConfig } from '../types';

export const distributionScopesFilterConfig: FilterConfig = {
  key: 'distribution_scopes',
  order: 85,
  isCommon: true,
  calculator: (filterData) => {
    return filterData.distribution_scopes?.default?.value ?? null;
  },
  dependentDefaultCascadingCalculator: (filterData, currentValues) => {
    const scopes = filterData.distribution_scopes?.values;
    return scopes?.[0]?.value ?? null;
  },
  validator: (filterData, value) => {
    const options = filterData.distribution_scopes?.values || [];
    return options.some((opt) => opt.value === value);
  },
  metadata: {
    displayName: 'Distribution Scopes',
    description: 'Scopes for bees distribution',
  },
};
