import { FilterConfig } from '../types';

export const zonesFilterConfig: FilterConfig = {
  key: 'zone',
  order: 30,
  isCommon: true,
  calculator: (filterData, currentDefaults) => {
    const defaultZone = filterData.zones?.default?.value;
    const defaultCountries = filterData.country?.values?.[defaultZone];
    const countriesByZone = filterData.country?.values;

    if (defaultCountries && defaultCountries.length > 0) {
      return defaultZone;
    }

    for (const [zone, countries] of Object.entries(countriesByZone ?? {})) {
      if (Array.isArray(countries) && countries.length > 0) {
        return zone;
      }
    }

    return null;
  },
  validator: (filterData, value) => {
    const options = filterData.zones?.values || [];
    return options.some((opt) => opt.value === value);
  },
  contextualValidator: (dataFilters, _parent, zoneValue) => {
    const countries = (dataFilters as any)?.country?.values?.[zoneValue];
    return Array.isArray(countries) && countries.length > 0;
  },
  dependencies: [
    'country',
    'brands',
    'sub_brands',
    'brands_abi',
    'brands_comp',
    'brand_filter_groupings',
    'audience_targeting_brands',
    'audience_targeting_brands_comp',
    'scopes',
    'sub_scopes',
    'global_brands',
    'growth_levers',
  ],
  metadata: {
    displayName: 'Zones',
    description: 'Geographic zones filter',
  },
};
