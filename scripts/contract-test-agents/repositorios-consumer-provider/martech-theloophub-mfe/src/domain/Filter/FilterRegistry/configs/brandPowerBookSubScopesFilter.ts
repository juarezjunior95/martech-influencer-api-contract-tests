import { FilterConfig } from '../types';

export const brandPowerBookSubScopesFilterConfig: FilterConfig = {
  key: 'sub_scopes',
  order: 81,
  isCommon: true,
  parentKey: 'scopes',
  calculator: (filterData, currentDefaults) => {
    return null;
  },
  validator: (filterData, value) => {
    const globalBrandsData =
      filterData.global_brands?.values.flatMap((value) => value.values) || [];
    const portfolioData = filterData.portfolio?.values || [];
    const segmentsData = filterData.segments?.values || [];

    const allData = [...globalBrandsData, ...portfolioData, ...segmentsData];

    return allData.some((data) => data.value === value);
  },

  dependentDefaultCascadingCalculator: (filterData, currentValues) => {
    const scope = currentValues.scopes;

    if (!scope) {
      return null;
    }

    const scopeHandlers = {
      segment: () => filterData.segments?.values?.[0]?.value ?? null,
      global_brands: () =>
        filterData.global_brands?.values?.[0]?.values[0]?.value ?? null,
      portfolio: () => filterData.portfolio?.values?.[0]?.value ?? null,
    };

    const handler = scopeHandlers[scope];

    return handler ? handler() : null;
  },

  contextualValidator: (dataFilters, scope, subScope) => {
    let scopeData = null;

    if (scope === 'segment') {
      scopeData = dataFilters.segments?.values;
    }

    if (scope === 'global_brands') {
      scopeData = dataFilters.global_brands?.values.flatMap(
        (value) => value.values,
      );
    }

    if (scope === 'portfolio') {
      scopeData = dataFilters.portfolio?.values;
    }

    if (!scopeData) return false;

    return scopeData?.some((data) => data.value === subScope);
  },
  metadata: {
    displayName: 'Brand Power Book Sub Scopes',
    description: 'Sub scopes for brand power book',
  },
};
