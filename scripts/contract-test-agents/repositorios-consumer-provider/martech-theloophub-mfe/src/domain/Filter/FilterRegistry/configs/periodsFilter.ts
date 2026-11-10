import { FilterConfig } from '../types';

const POWER_PERIODS_FALLBACK_MAP: Record<string, string> = {
  L3M: 'QTD',
  MTD: 'QTD',
};

export const periodsFilterConfig: FilterConfig = {
  key: 'periods',
  order: 20,
  isCommon: true,
  calculator: (filterData) => {
    return filterData.periods?.default?.value ?? null;
  },
  validator: (filterData, value) => {
    return filterData.periods?.values?.some((opt) => opt?.value === value);
  },
  dependentDefaultCascadingCalculator: (filterData, currentValues) => {
    const currentPeriod = String(currentValues.periods ?? '');

    if (
      filterData.periods?.values?.some((opt) => opt?.value === currentPeriod)
    ) {
      return currentPeriod;
    }

    const fallback = POWER_PERIODS_FALLBACK_MAP[currentPeriod];
    if (fallback) {
      const isValid = filterData.periods?.values?.some(
        (opt) => opt?.value === fallback,
      );
      if (isValid) return fallback;
    }

    return filterData.periods?.default?.value ?? null;
  },
  fallbackCollisionResolver: (
    previousValue,
    currentDefault,
    currentDataFilters,
  ) => {
    const fallback = POWER_PERIODS_FALLBACK_MAP[String(previousValue)];
    if (!fallback) return currentDefault;

    const isValid = currentDataFilters.periods?.values?.some(
      (opt) => opt?.value === fallback,
    );

    return isValid ? fallback : currentDefault;
  },
  metadata: {
    displayName: 'POS Periods',
    description: 'POS periods filter',
  },
};
