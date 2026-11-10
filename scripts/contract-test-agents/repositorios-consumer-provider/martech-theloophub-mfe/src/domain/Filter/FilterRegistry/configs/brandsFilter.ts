import { FilterConfig } from '../types';
import { validateBrandsInCountry } from '../utils';

export const brandsFilterConfig: FilterConfig = {
  key: 'brands',
  order: 50,
  isCommon: true,
  parentKey: 'country',
  calculator: (filterData, currentDefaults) => {
    if (Array.isArray(filterData.brands?.values)) {
      return (
        filterData.brands?.default?.value ??
        filterData.brands?.values?.[0]?.value ??
        null
      );
    }

    const countryValue = currentDefaults.country;

    if (countryValue) {
      const brandsData = filterData.brands?.values;
      const countryBrands = brandsData?.[String(countryValue)];
      const defaultBrand =
        countryBrands?.brands?.[0]?.value ??
        countryBrands?.default?.value ??
        filterData.brands?.default?.value ??
        null;

      if (defaultBrand && currentDefaults) {
        const selectedBrand = countryBrands?.brands?.find(
          (b) => b.value === defaultBrand,
        );

        if (selectedBrand?.sub_brands?.[0]?.value) {
          currentDefaults.sub_brands = selectedBrand.sub_brands[0].value;
        }
      }

      return defaultBrand;
    }

    return filterData.brands?.default?.value ?? null;
  },
  dependentDefaultCascadingCalculator: (filterData, currentValues) => {
    if (Array.isArray(filterData.brands?.values)) {
      return (
        filterData.brands?.default?.value ??
        filterData.brands?.values?.[0]?.value ??
        null
      );
    }

    const countryValue = currentValues.country;
    if (!countryValue) {
      return null;
    }
    const brandsData = filterData.brands?.values;
    const countryBrands = brandsData?.[String(countryValue)];
    return (
      countryBrands?.brands?.[0]?.value ?? countryBrands?.default?.value ?? null
    );
  },
  validator: (filterData, value) => {
    const brandsData = filterData.brands?.values;
    if (!brandsData) return false;

    if (Array.isArray(brandsData)) {
      return brandsData.some((brand) => brand.value === value);
    }

    return Object.values(brandsData).some((countryBrands) =>
      countryBrands.brands?.some((brand) => brand.value === value),
    );
  },
  contextualValidator: (dataFilters, country, brand) => {
    const brandsData = (dataFilters as any).brands;
    if (Array.isArray(brandsData?.values)) {
      return brandsData.values.some((b: any) => b.value === brand);
    }

    return validateBrandsInCountry(
      'brands',
      dataFilters,
      String(country),
      String(brand),
    );
  },
  dependencies: ['sub_brands'],
  metadata: {
    displayName: 'Brands',
    description: 'Brands filter, depends on selected country',
  },
};
