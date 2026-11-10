import { FilterConfig } from '../types';

export const growthLeversFilterConfig: FilterConfig = {
  key: 'growth_levers',
  order: 31,
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

        if (selectedCountry?.growth_levers) {
          const defaultValue = selectedCountry.growth_levers.default?.value;
          const fallbackValue =
            selectedCountry.growth_levers.values?.[0]?.value;
          const finalValue = defaultValue || fallbackValue || null;

          return finalValue;
        }
      }
    }

    if (filterData.growth_levers) {
      const defaultValue = filterData.growth_levers.default?.value;
      const fallbackValue = filterData.growth_levers.values?.[0]?.value;
      const finalValue = defaultValue || fallbackValue || null;

      return finalValue;
    }

    return null;
  },

  validator: (filterData, value) => {
    if (!filterData.growth_levers?.values) {
      return false;
    }

    const options = filterData.growth_levers.values;
    const isValid = options.some((opt) => opt.value === value);

    return isValid;
  },
  dependentDefaultCascadingCalculator: (filterData, currentValues) => {
    if (!filterData.growth_levers?.values) {
      return null;
    }

    if (
      filterData.growth_levers.values.some(
        (opt) => opt.value === currentValues.growth_levers,
      )
    ) {
      return currentValues.growth_levers;
    }

    return (
      filterData.growth_levers?.default?.value ??
      filterData.growth_levers?.values?.[0]?.value ??
      null
    );
  },

  dependencies: [
    'brand_filter_groupings',
    'beer_price_segment',
    'brands',
    'sub_brands',
    'global_brands',
    'portfolios',
  ],

  metadata: {
    displayName: 'Growth Levers',
    description: 'Growth Levers filter, depends on selected country',
  },
};
