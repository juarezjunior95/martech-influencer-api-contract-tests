import { FilterConfig } from '../types';

export const brandFilterGroupingsFilterConfig: FilterConfig = {
  key: 'brand_filter_groupings',
  order: 32,
  isCommon: true,
  parentKey: 'country',
  calculator: (filterData, currentDefaults) => {
    const countryValue = currentDefaults.country;
    const zoneValue = currentDefaults.zone;

    if (countryValue && zoneValue && filterData.country?.values) {
      const countriesInZone = filterData.country.values[zoneValue];

      if (Array.isArray(countriesInZone)) {
        const selectedCountry = countriesInZone.find(
          (c) => c.value === countryValue,
        ) as any;

        if (selectedCountry?.brand_filter_groupings) {
          const defaultValue =
            selectedCountry.brand_filter_groupings.default?.value;
          const fallbackValue =
            selectedCountry.brand_filter_groupings.values?.[0]?.value;
          const finalValue = defaultValue || fallbackValue || null;

          return finalValue;
        }
      }
    }

    if (filterData.brand_filter_groupings) {
      const defaultValue = filterData.brand_filter_groupings.default?.value;
      const fallbackValue =
        filterData.brand_filter_groupings.values?.[0]?.value;
      const finalValue = defaultValue || fallbackValue || null;

      return finalValue;
    }

    return null;
  },

  validator: (filterData, value) => {
    if (!filterData.brand_filter_groupings?.values) {
      return false;
    }

    const options = filterData.brand_filter_groupings.values;
    const isValid = options.some((opt) => opt.value === value);

    return isValid;
  },
  dependentDefaultCascadingCalculator: (filterData, currentValues) => {
    if (!filterData.brand_filter_groupings?.values) {
      return null;
    }

    const brand_filter_groupingsValue = currentValues.brand_filter_groupings;

    if (
      filterData?.brand_filter_groupings?.values?.some(
        (opt) => opt.value === brand_filter_groupingsValue,
      )
    ) {
      return brand_filter_groupingsValue;
    }

    return (
      filterData.brand_filter_groupings?.default?.value ??
      filterData.brand_filter_groupings?.values?.[0]?.value ??
      null
    );
  },
  dependencies: [
    'brands',
    'portfolios',
    'sub_brands',
    'beer_price_segment',
    'global_brands',
  ],
  metadata: {
    displayName: 'Brand Filter Groupings',
    description: 'Brand Filter Groupings filter, depends on selected country',
  },
};
