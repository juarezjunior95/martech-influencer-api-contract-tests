import { FilterConfig } from '../types';

export const audienceTargetingBrandsCompFilterConfig: FilterConfig = {
  key: 'audience_targeting_brands_comp',
  order: 91,
  isCommon: true,
  calculator: (filterData, currentDefaults) => {
    const countryValue = currentDefaults.country;
    const audienceTargetingBrandsValue =
      currentDefaults.audience_targeting_brands;

    if (!countryValue || !audienceTargetingBrandsValue) {
      return null;
    }

    const audienceTargetingBrandsData =
      filterData.audience_targeting_brands?.values?.[String(countryValue)];
    const selectedBrand = audienceTargetingBrandsData?.find(
      (item) => item.value === audienceTargetingBrandsValue,
    );

    return selectedBrand?.competitor?.[0]?.value ?? null;
  },
  dependentDefaultCascadingCalculator: (filterData, currentValues) => {
    const countryValue = currentValues.country;
    const audienceTargetingBrandsValue =
      currentValues.audience_targeting_brands;

    if (!countryValue || !audienceTargetingBrandsValue) {
      return null;
    }

    const audienceTargetingBrandsData =
      filterData.audience_targeting_brands?.values?.[String(countryValue)];
    const selectedBrand = audienceTargetingBrandsData?.find(
      (item) => item.value === audienceTargetingBrandsValue,
    );

    return selectedBrand?.competitor?.[0]?.value ?? null;
  },
  validator: (filterData, value) => {
    const values = Object.values(
      filterData.audience_targeting_brands?.values || {},
    ).flatMap((item) => item.flatMap((item) => item.competitor));

    return values.some((item) => item.value === value);
  },
  metadata: {
    displayName: 'Audience Targeting Brands Competitor',
    description: 'Competitor brands for audience targeting',
  },
};
