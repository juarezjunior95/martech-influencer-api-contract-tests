import { Option } from 'models/Filters';

import { FilterConfig } from '../types';

export const globalBrandsFilterConfig: FilterConfig = {
  key: 'global_brands',
  order: 50,
  isCommon: true,
  parentKey: 'country',
  calculator: (filterData, currentDefaults) => {
    return null;
  },
  dependentDefaultCascadingCalculator: (filterData, currentValues) => {
    if (
      filterData.global_brands?.values.some(
        (opt: any) => opt.value === currentValues.global_brands,
      )
    ) {
      return currentValues.global_brands;
    }

    const values: Option[] = filterData.global_brands
      ?.values as unknown as Option[];

    return (
      filterData.global_brands?.default?.value ?? values?.[0]?.value ?? null
    );
  },
  validator: (filterData, value) => {
    if (!filterData.global_brands?.values) {
      return false;
    }
    const values = filterData.global_brands.values;
    if (!Array.isArray(values)) {
      return false;
    }
    return values.some((opt: any) =>
      opt.values
        ? opt.values.some((v: any) => v.value === value)
        : opt.value === value,
    );
  },
  dependencies: ['sub_brands'],
};
