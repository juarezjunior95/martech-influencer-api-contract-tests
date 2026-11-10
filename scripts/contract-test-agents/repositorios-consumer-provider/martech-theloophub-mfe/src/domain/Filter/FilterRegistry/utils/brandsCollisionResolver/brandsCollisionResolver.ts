import type { FilterDataStructure, FilterValue } from 'models/Filters';

import type FilterRegistry from '../../FilterRegistry';

type BrandsResult = Partial<Record<string, FilterValue>>;

const getDefaultBrandsResult = (
  currentDefaults: Record<string, FilterValue>,
): BrandsResult => ({
  brands: currentDefaults.brands,
  sub_brands: currentDefaults.sub_brands,
});

const findValueInGroupsByLabel = (
  groups: any[],
  targetLabel: FilterValue,
): FilterValue | undefined => {
  for (const group of groups) {
    const hasValues = 'values' in group && Array.isArray(group.values);
    if (!hasValues) continue;

    const found = group.values.find(
      (opt: any) => String(opt?.label || '') === String(targetLabel),
    );
    if (found?.value) return found.value;
  }
  return undefined;
};

const findMatchingSubBrand = (
  registry: FilterRegistry,
  currentDataFilters: FilterDataStructure,
  brands: any[],
  brandsAbiValue: FilterValue,
): BrandsResult | undefined => {
  for (const brand of brands) {
    const hasSubBrands = brand.sub_brands && Array.isArray(brand.sub_brands);
    if (!hasSubBrands) continue;

    const selectedSubBrand = brand.sub_brands.find(
      (subBrand: any) => subBrand.value === brandsAbiValue,
    );
    if (!selectedSubBrand) continue;

    const brandExists = registry.isValueValid(
      'brands',
      currentDataFilters,
      brand.value,
    );
    const subBrandExists = registry.isValueValid(
      'sub_brands',
      currentDataFilters,
      selectedSubBrand.value,
    );

    if (brandExists && subBrandExists) {
      return { brands: brand.value, sub_brands: selectedSubBrand.value };
    }
  }
  return undefined;
};

/**
 * Resolve collisions between brands and brands_abi
 */
export function resolveBrandsCollisions(
  registry: FilterRegistry,
  previousApplied: Record<string, FilterValue>,
  currentDataFilters: FilterDataStructure,
  currentDefaults: Record<string, FilterValue>,
  previousCountry: FilterValue,
): BrandsResult {
  const hasPreviousBrands = !!previousApplied.brands;
  const hasPreviousBrandsAbi = !!previousApplied.brands_abi;
  const hasCurrentBrands = !!currentDataFilters.brands;
  const hasCurrentBrandsAbi = !!currentDataFilters.brands_abi;

  const shouldConvertBrandsToBrandsAbi =
    hasPreviousBrands && hasCurrentBrandsAbi && !hasCurrentBrands;
  const shouldConvertBrandsAbiToBrands =
    hasPreviousBrandsAbi && hasCurrentBrands && !hasCurrentBrandsAbi;

  if (shouldConvertBrandsToBrandsAbi) {
    return resolveBrandsToBrandsAbi(
      previousApplied,
      currentDataFilters,
      currentDefaults,
      previousCountry,
    );
  }

  if (shouldConvertBrandsAbiToBrands) {
    return resolveBrandsAbiToBrands(
      registry,
      previousApplied,
      currentDataFilters,
      currentDefaults,
      previousCountry,
    );
  }

  return {};
}

/**
 * Convert brands + sub_brands to brands_abi
 */
function resolveBrandsToBrandsAbi(
  previousApplied: Record<string, FilterValue>,
  currentDataFilters: FilterDataStructure,
  currentDefaults: Record<string, FilterValue>,
  previousCountry: FilterValue,
): BrandsResult {
  const defaultResult = { brands_abi: currentDefaults.brands_abi };
  const subBrandValue = previousApplied.sub_brands;
  const brandValue = previousApplied.brands;

  if (!brandValue || !subBrandValue) return defaultResult;

  const brandsAbiData = currentDataFilters.brands_abi?.values;
  if (!brandsAbiData || !previousCountry) return defaultResult;

  const countryBrandsAbi = brandsAbiData[String(previousCountry)];
  if (!Array.isArray(countryBrandsAbi)) return defaultResult;

  const subBrandMatch = findValueInGroupsByLabel(
    countryBrandsAbi,
    subBrandValue,
  );
  if (subBrandMatch) return { brands_abi: subBrandMatch };

  const brandMatch = findValueInGroupsByLabel(countryBrandsAbi, brandValue);
  if (brandMatch) return { brands_abi: brandMatch };

  return defaultResult;
}

/**
 * Convert brands_abi to brands + sub_brands
 * Follows the same logic as findBrandsAbiEquivalences in filterEquivalences middleware
 */
function resolveBrandsAbiToBrands(
  registry: FilterRegistry,
  previousApplied: Record<string, FilterValue>,
  currentDataFilters: FilterDataStructure,
  currentDefaults: Record<string, FilterValue>,
  previousCountry: FilterValue,
): BrandsResult {
  const defaultResult = getDefaultBrandsResult(currentDefaults);
  const brandsAbiValue = previousApplied.brands_abi;

  if (!brandsAbiValue) return defaultResult;

  const brandsData = currentDataFilters.brands?.values;
  if (!brandsData || !previousCountry) return defaultResult;

  const countryBrands = brandsData[String(previousCountry)];
  if (!countryBrands?.brands) return defaultResult;

  const selectedBrand = countryBrands.brands.find(
    (brand: any) => brand.value === brandsAbiValue,
  );

  if (selectedBrand) {
    const brandExists = registry.isValueValid(
      'brands',
      currentDataFilters,
      selectedBrand.value,
    );
    if (brandExists) {
      return {
        brands: selectedBrand.value,
        sub_brands: currentDefaults.sub_brands,
      };
    }
  }

  const subBrandMatch = findMatchingSubBrand(
    registry,
    currentDataFilters,
    countryBrands.brands,
    brandsAbiValue,
  );

  return subBrandMatch ?? defaultResult;
}
