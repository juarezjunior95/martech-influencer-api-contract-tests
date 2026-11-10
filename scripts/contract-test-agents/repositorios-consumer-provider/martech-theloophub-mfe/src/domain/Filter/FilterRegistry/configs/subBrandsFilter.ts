import { FilterConfig } from '../types';

export const subBrandsFilterConfig: FilterConfig = {
  key: 'sub_brands',
  order: 51,
  isCommon: true,
  parentKey: 'brands',
  calculator: (filterData, currentDefaults) => {
    if (Array.isArray(filterData.sub_brands?.values)) {
      return null;
    }

    const countryValue = currentDefaults.country;
    const brandValue = currentDefaults.brands;

    if (!countryValue || !brandValue) {
      return null;
    }

    const brandsData = filterData.brands?.values;
    const countryBrands = brandsData?.[String(countryValue)];
    const selectedBrand = countryBrands?.brands?.find(
      (b) => b.value === brandValue,
    );

    return selectedBrand?.sub_brands?.[0]?.value ?? null;
  },
  dependentDefaultCascadingCalculator: (filterData, currentValues) => {
    if (Array.isArray(filterData.sub_brands?.values)) {
      return null;
    }

    const countryValue = currentValues.country;
    const brandValue = currentValues.brands;

    if (!countryValue || !brandValue) {
      return null;
    }

    const brandsData = filterData.brands?.values;
    const countryBrands = brandsData?.[String(countryValue)];
    const selectedBrand = countryBrands?.brands?.find(
      (b) => b.value === brandValue,
    );

    return selectedBrand?.sub_brands?.[0]?.value ?? null;
  },
  validator: (filterData, value) => {
    const subBrandsValues = filterData.sub_brands?.values;
    if (Array.isArray(subBrandsValues) && subBrandsValues.length > 0) {
      return subBrandsValues.some((sb: any) => sb.value === value);
    }

    const brandsData = filterData.brands?.values;
    if (!brandsData) return false;

    return Object.values(brandsData).some((countryBrands) =>
      countryBrands.brands?.some((brand) =>
        brand.sub_brands?.some((subBrand) => subBrand.value === value),
      ),
    );
  },
  contextualValidator: (dataFilters, brandValue, subBrandValue) => {
    if (brandValue === 'null') return false;

    if (!subBrandValue || subBrandValue === 'All') {
      return true;
    }

    const subBrandsData = (dataFilters as any).sub_brands;
    if (
      Array.isArray(subBrandsData?.values) &&
      subBrandsData.values.length > 0
    ) {
      return subBrandsData.values.some((sb: any) => sb.value === subBrandValue);
    }

    if (!brandValue || brandValue === 'All') {
      return false;
    }

    const brandsData = dataFilters.brands as any;
    if (!brandsData?.values) {
      return false;
    }

    const allBrands = Object.values(brandsData.values).flatMap(
      (countryData: any) => countryData?.brands || [],
    );

    const brandInstances = allBrands.filter((b: any) => b.value === brandValue);

    if (brandInstances.length === 0) {
      return false;
    }

    const subBrandExists = brandInstances.some((brand: any) =>
      brand.sub_brands?.some((sb: any) => sb.value === subBrandValue),
    );

    return subBrandExists;
  },
  metadata: {
    displayName: 'Sub Brands',
    description: 'Sub-brands filter, depends on selected brand and country',
  },
};
