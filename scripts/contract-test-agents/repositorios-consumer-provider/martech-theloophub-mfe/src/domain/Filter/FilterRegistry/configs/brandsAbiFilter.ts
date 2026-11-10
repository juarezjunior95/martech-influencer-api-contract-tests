import { FilterConfig } from '../types';
import { validateBrandsInCountry } from '../utils';

export const brandsAbiFilterConfig: FilterConfig = {
  key: 'brands_abi',
  order: 60,
  isCommon: true,
  parentKey: 'country',
  calculator: (filterData) => {
    return filterData.brands_abi?.default?.value ?? null;
  },
  dependentDefaultCascadingCalculator: (filterData, currentValues) => {
    const countryValue = currentValues.country;

    if (!countryValue) {
      return null;
    }

    const brandsAbiData = filterData.brands_abi?.values;
    const countryBrandsAbi = brandsAbiData?.[String(countryValue)] as unknown;

    if (Array.isArray(countryBrandsAbi) && countryBrandsAbi.length > 0) {
      const firstGroup = countryBrandsAbi[0];
      if (
        firstGroup &&
        typeof firstGroup === 'object' &&
        'values' in firstGroup
      ) {
        const values = (firstGroup as { values: unknown }).values;
        if (Array.isArray(values) && values.length > 0) {
          const firstValue = values[0];
          if (
            firstValue &&
            typeof firstValue === 'object' &&
            'value' in firstValue
          ) {
            return (firstValue as { value: string | number | null }).value;
          }
        }
      }
    }

    return null;
  },
  validator: (filterData, value) => {
    const groupedBrands = filterData.brands_abi;
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
      'brands_abi',
      dataFilters,
      String(country),
      String(brand),
    );
  },
  metadata: {
    displayName: 'Brands ABI',
    description: 'AB InBev brands filter',
  },
};
