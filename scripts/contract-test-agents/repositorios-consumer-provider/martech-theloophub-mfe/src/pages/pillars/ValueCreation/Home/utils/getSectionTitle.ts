import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import type { FilterDataStructure, FilterForm } from 'models/Filters';

const DEFAULT_SECOND_LEVEL = 'Sustainable Growth';
const OVERVIEW_SUFFIX = 'Overview';
const ZONE_EUR = 'EUR';
const COUNTRY_GLOBAL = 'ABI';
const EUROPE_LABEL = 'Europe';

function safeStringLabel(label: unknown): string {
  return typeof label === 'string' ? label : '';
}

export function getGeoLabel(
  dataFilters: FilterDataStructure,
  applied: FilterForm,
): string {
  if (applied.zone === ZONE_EUR && applied.country === COUNTRY_GLOBAL) {
    return EUROPE_LABEL;
  }

  const country = FilterDataAccessor.getInstance().getCountry(
    dataFilters,
    applied,
  );
  return safeStringLabel(country?.label);
}

export function getGrowthLeverLabel(
  dataFilters: FilterDataStructure,
  applied: FilterForm,
): string {
  const value = applied.value_creation_growth_levers;
  if (!value) return '';

  const options = FilterDataAccessor.getInstance().getOptions(
    'value_creation_growth_levers',
    dataFilters,
    applied,
  );
  const option = (options as { value: unknown; label: unknown }[]).find(
    (o) => o.value === value,
  );
  return safeStringLabel(option?.label);
}

export function getSustainableGrowthOverviewTitle(
  dataFilters: FilterDataStructure,
  applied: FilterForm,
): string {
  const geoLabel = getGeoLabel(dataFilters, applied);
  const growthLeverLabel = getGrowthLeverLabel(dataFilters, applied);
  const secondLevel = growthLeverLabel || DEFAULT_SECOND_LEVEL;

  return [geoLabel, secondLevel, OVERVIEW_SUFFIX].filter(Boolean).join(' ');
}
