import { ValueCreationData } from 'domain/Filter/FilterDataTransformer';
import { ValueCreationCountryOption } from 'domain/Filter/FilterDataTransformer/ValueCreationFilterDataTransformer';
import { FilterDataStructure } from 'models/Filters';

import { FilterConfig } from '../types';

export const valueCreationGrowthLeversFilter: FilterConfig = {
  key: 'value_creation_growth_levers',
  order: 31,
  isCommon: true,
  parentKey: 'country',
  calculator: () => {
    return null;
  },

  validator: (
    filterData: ValueCreationData & FilterDataStructure,
    value,
    currentApplied,
  ) => {
    if (value === null) return true;

    const zoneCountries = filterData.country?.values;
    const allCountries = Object.values(zoneCountries).flat();
    const country = allCountries.find(
      (c) => c.value === currentApplied?.country,
    ) as ValueCreationCountryOption;

    if (!country) return false;

    return country?.growth_levers?.some(
      (opt) => opt.value === value && !opt.disabled,
    );
  },
  contextualValidator: (
    filterData: ValueCreationData & FilterDataStructure,
    currentCountry,
    growthLevers,
  ) => {
    const zoneCountries = filterData.country?.values;
    const allCountries = Object.values(zoneCountries).flat();
    const country = allCountries.find(
      (c) => c.value === currentCountry,
    ) as ValueCreationCountryOption;

    return country.growth_levers?.some(
      (opt) => opt.value === growthLevers && !opt.disabled,
    );
  },
  dependentDefaultCascadingCalculator: (
    filterData: ValueCreationData & FilterDataStructure,
    currentValues,
  ) => {
    const valueCreationGrowthLevers =
      currentValues.value_creation_growth_levers;
    if (!valueCreationGrowthLevers) return null;

    const zoneCountries = filterData.country?.values?.[currentValues.zone];

    if (!zoneCountries) return null;
    const country = zoneCountries.find(
      (country) => country.value === currentValues.country,
    );

    if (!country) return null;

    if (
      country.growth_levers?.some(
        (opt) => opt.value === valueCreationGrowthLevers && !opt.disabled,
      )
    ) {
      return valueCreationGrowthLevers;
    }

    return null;
  },

  dependencies: [],
  metadata: {
    displayName: 'Value Creation Growth Levers',
    description:
      'Value Creation Growth Levers filter, depends on selected country',
  },
};
