import { FilterConfig } from '../types';
import { validateBrandsInCountry } from '../utils';

export const brandsCompFilterConfig: FilterConfig = {
  key: 'brands_comp',
  order: 70,
  isCommon: true,
  parentKey: 'country',
  calculator: (filterData) => {
    return filterData.brands_comp?.default?.value ?? null;
  },
  validator: (filterData, value) => {
    const groupedBrands = filterData.brands_comp;
    if (!groupedBrands) return false;
    return Object.values(groupedBrands.values || {}).some(
      (countryGroups) =>
        Array.isArray(countryGroups) &&
        countryGroups.some(
          (group) =>
            'values' in group &&
            Array.isArray(group.values) &&
            group.values.some((opt) => opt.value === value),
        ),
    );
  },

  contextualValidator: (dataFilters, country, brand) => {
    return validateBrandsInCountry(
      'brands_comp',
      dataFilters,
      String(country),
      String(brand),
    );
  },
  metadata: {
    displayName: 'Brands Competitor',
    description: 'Competitor brands filter',
  },
};
