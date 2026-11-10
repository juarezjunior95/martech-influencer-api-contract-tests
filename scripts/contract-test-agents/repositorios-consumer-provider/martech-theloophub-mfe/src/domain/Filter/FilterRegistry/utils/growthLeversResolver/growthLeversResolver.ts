import type { FilterDataStructure, FilterValue } from 'models/Filters';

import type { ValueCreationCountryOption } from '../../../FilterDataTransformer/ValueCreationFilterDataTransformer';

type GrowthLeversResult = Partial<
  Record<'growth_levers' | 'value_creation_growth_levers', FilterValue>
>;

/**
 * Resolve collisions between growth_levers and value_creation_growth_levers
 * when changing pages (Value Creation context).
 * - value_creation_growth_levers → maps to flat growth_levers on current page
 * - growth_levers → maps to value_creation_growth_levers using country's options
 */
export function resolveGrowthLeversCollisions(
  previousApplied: Record<string, FilterValue>,
  currentDataFilters: FilterDataStructure,
  currentDefaults: Record<string, FilterValue>,
  resolved: Record<string, FilterValue>,
): GrowthLeversResult {
  const result: GrowthLeversResult = {};

  if (
    previousApplied.value_creation_growth_levers &&
    currentDataFilters.growth_levers?.values
  ) {
    const growthLever = currentDataFilters.growth_levers.values.find(
      (option: { value?: FilterValue }) =>
        option.value === previousApplied.value_creation_growth_levers,
    );

    if (growthLever?.value == null) {
      result.growth_levers = currentDefaults.growth_levers;
    } else {
      result.growth_levers = growthLever.value;
    }
  }

  if (previousApplied.growth_levers && currentDataFilters.country?.values) {
    const countries: ValueCreationCountryOption[] = Object.values(
      currentDataFilters.country.values,
    ).flat();

    const countryOption = countries.find(
      (option: ValueCreationCountryOption) => option.value === resolved.country,
    );
    const growthLever = countryOption?.growth_levers?.find(
      (gl) => gl.value === previousApplied.growth_levers && !gl.disabled,
    );

    if (growthLever) {
      result.value_creation_growth_levers = growthLever.value;
    } else {
      result.value_creation_growth_levers =
        currentDefaults.value_creation_growth_levers;
    }
  }

  return result;
}
