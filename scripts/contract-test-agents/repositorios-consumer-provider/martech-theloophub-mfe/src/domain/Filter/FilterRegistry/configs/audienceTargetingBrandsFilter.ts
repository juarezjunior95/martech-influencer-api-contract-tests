import { FilterConfig } from '../types';

export const audienceTargetingBrandsFilterConfig: FilterConfig = {
  key: 'audience_targeting_brands',
  order: 90,
  isCommon: true,
  calculator: (filterData, currentDefaults) => {
    const countryValue = currentDefaults.country;
    const audienceTargetingBrandsDefault =
      filterData.audience_targeting_brands?.values?.[String(countryValue)]?.[0];
    const audienceTargetingBrandsCompetitorDefault =
      audienceTargetingBrandsDefault?.competitor?.[0]?.value;

    if (audienceTargetingBrandsDefault) {
      if (audienceTargetingBrandsCompetitorDefault && currentDefaults) {
        currentDefaults.audience_targeting_brands_comp =
          audienceTargetingBrandsCompetitorDefault;
      }

      return audienceTargetingBrandsDefault.value;
    }

    return null;
  },
  dependentDefaultCascadingCalculator: (filterData, currentValues) => {
    const countryValue = currentValues.country;

    if (!countryValue) {
      return null;
    }

    const brandsData = filterData.audience_targeting_brands as any;
    const countryBrands = brandsData?.values?.[countryValue];

    return countryBrands?.[0]?.value ?? null;
  },
  validator: (filterData, value) => {
    if (!value) return true;

    const brandsData = filterData.audience_targeting_brands as any;
    if (!brandsData?.values) return false;

    for (const countryBrands of Object.values(brandsData.values)) {
      if (Array.isArray(countryBrands)) {
        const found = countryBrands.some((b: any) => b.value === value);
        if (found) return true;
      }
    }

    return false;
  },
  contextualValidator: (dataFilters, countryValue, brandValue) => {
    if (!brandValue) return true;
    if (!countryValue) return false;

    const brandsData = dataFilters.audience_targeting_brands as any;
    if (!brandsData?.values) return false;

    const countryBrands = brandsData.values[countryValue];

    if (!Array.isArray(countryBrands)) {
      return false;
    }

    return countryBrands.some((b: any) => b.value === brandValue);
  },
  dependencies: ['audience_targeting_brands_comp'],
  metadata: {
    displayName: 'Audience Targeting Brands',
    description: 'Brands for audience targeting',
  },
};
