import { FilterDataStructure, FilterValue } from 'models/Filters';

import { FilterConfig } from '../types';
import { findInArray } from '../utils';

type CountryValues = NonNullable<FilterDataStructure['country']>['values'];

const getValidDefaultCountry = (
  countryData: CountryValues | undefined,
  countryDefault: FilterValue | undefined,
): FilterValue => {
  if (!countryDefault || !countryData) return null;

  const countryExists = Object.values(countryData).some((countries) =>
    countries.some((opt) => opt.value === countryDefault),
  );

  return countryExists ? countryDefault : null;
};

const getFirstCountryInZone = (
  countryData: CountryValues | undefined,
  zoneValue: FilterValue | undefined,
): FilterValue => {
  if (!zoneValue || !countryData) return null;

  return countryData[String(zoneValue)]?.[0]?.value ?? null;
};

const getFirstAvailableCountry = (
  countryData: CountryValues | undefined,
): FilterValue => {
  if (!countryData) return null;

  const firstZoneWithCountries = Object.values(countryData).find(
    (countries) => countries && countries.length > 0,
  );

  return firstZoneWithCountries ? firstZoneWithCountries[0].value : null;
};

export const countryFilterConfig: FilterConfig = {
  key: 'country',
  order: 40,
  isCommon: true,
  parentKey: 'zone',
  calculator: (filterData, currentDefaults) => {
    const countryData = filterData.country?.values;
    const countryDefault = filterData.country?.default?.value;
    const zoneValue = currentDefaults.zone;

    return (
      getValidDefaultCountry(countryData, countryDefault) ??
      getFirstCountryInZone(countryData, zoneValue) ??
      getFirstAvailableCountry(countryData)
    );
  },
  dependentDefaultCascadingCalculator: (filterData, currentValues) => {
    const countryData = filterData.country?.values;
    if (!countryData) return null;

    if (Array.isArray(countryData)) {
      return countryData[0]?.value ?? null;
    }

    const zoneValue = currentValues.zone;
    if (!zoneValue) return null;

    if (zoneValue === 'ABI') {
      return 'ABI';
    }

    const countriesInZone = countryData[String(zoneValue)];
    const currentCountry = currentValues.country;

    if (
      currentCountry &&
      Array.isArray(countriesInZone) &&
      countriesInZone.some((c) => c?.value === currentCountry)
    ) {
      return currentCountry;
    }

    return countriesInZone?.[0]?.value ?? null;
  },
  validator: (filterData, value) => {
    const countryData = filterData.country?.values;
    if (!countryData) return false;

    if (Array.isArray(countryData)) {
      return countryData.some((opt) => opt.value === value);
    }

    return Object.values(countryData).some((countries) =>
      countries.some((opt) => opt.value === value),
    );
  },
  fallbackCollisionResolver: (
    _previousValue, // required by FilterCollisionResolver signature to preserve parameter positions
    currentDefault,
    currentDataFilters,
  ) => {
    if (currentDefault != null) return currentDefault;

    const countryData = currentDataFilters.country?.values;
    if (!countryData) return null;

    if (Array.isArray(countryData)) {
      return countryData[0]?.value ?? null;
    }

    for (const countries of Object.values(countryData)) {
      const firstValid = countries?.[0]?.value;
      if (firstValid != null) return firstValid;
    }

    return null;
  },
  contextualValidator: (dataFilters, zone, country) => {
    const countryData = dataFilters.country as any;

    if (!zone) {
      return false;
    }

    const countriesInZone = countryData?.values?.[String(zone)];

    if (zone === 'ABI' && country !== 'ABI') {
      return false;
    }

    if (!Array.isArray(countriesInZone)) {
      return false;
    }

    return findInArray(countriesInZone, String(country), ['value', 'code']);
  },
  dependencies: [
    'brands',
    'sub_brands',
    'brands_abi',
    'brands_comp',
    'audience_targeting_brands',
    'audience_targeting_brands_comp',
    'brand_filter_groupings',
    'value_creation_growth_levers',
    'global_brands',
    'growth_levers',
  ],
  metadata: {
    displayName: 'Country',
    description: 'Country filter, depends on selected zone',
  },
};
