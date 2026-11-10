import { FilterDataStructure } from 'models/Filters';

export const validateBrandsInCountry = (
  key: string,
  dataFilters: FilterDataStructure,
  country: string,
  brand: string,
): boolean => {
  if (!brand) return true;
  if (!country) return false;

  const brandsData = dataFilters[key] as any;
  if (!brandsData?.values) return false;

  const countryData = brandsData.values[country];
  if (!countryData) return false;

  if (countryData.brands && Array.isArray(countryData.brands)) {
    return countryData.brands.some((b: any) => b.value === brand);
  }

  if (Array.isArray(countryData)) {
    return countryData.some(
      (group: any) =>
        group.values &&
        Array.isArray(group.values) &&
        group.values.some((opt: any) => opt.value === brand),
    );
  }

  return false;
};
