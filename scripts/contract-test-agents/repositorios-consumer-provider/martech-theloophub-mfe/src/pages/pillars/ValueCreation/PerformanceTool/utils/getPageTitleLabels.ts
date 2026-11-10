import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import type { FilterDataStructure, FilterForm } from 'models/Filters';

const ZONE_EUR = 'EUR';
const EUROPE_LABEL = 'Europe';
const ALL_LABEL = 'All';

/**
 * Fields considered for brand-level label in the page title, per KPI.
 * sub_brands has priority when selected (most specific).
 * global_brands for Global Brands classification, brands for others.
 * beer_price_segment for Beer Price Segment classification.
 * Power has no growth_levers; volume (and others) include it.
 * Add new KPIs or reorder fields here to extend behaviour.
 */
export const PAGE_TITLE_BRAND_LEVEL_FIELDS_BY_KPI: Record<
  string,
  (keyof FilterForm)[]
> = {
  power: ['brands', 'portfolios'],
  volume: [
    'sub_brands',
    'global_brands',
    'brands',
    'portfolios',
    'beer_price_segment',
    'growth_levers',
  ],
  market_share: [
    'sub_brands',
    'global_brands',
    'brands',
    'portfolios',
    'beer_price_segment',
    'growth_levers',
  ],
  cores: [
    'sub_brands',
    'global_brands',
    'brands',
    'portfolios',
    'beer_price_segment',
    'growth_levers',
  ],
};

const DEFAULT_BRAND_LEVEL_FIELDS: (keyof FilterForm)[] = [
  'sub_brands',
  'global_brands',
  'brands',
  'portfolios',
  'beer_price_segment',
  'growth_levers',
];

export function getCountryLabel(
  dataFilters: FilterDataStructure,
  applied: FilterForm,
): string {
  if (applied.zone === ZONE_EUR && applied.country === 'ABI') {
    return EUROPE_LABEL;
  }

  const country = FilterDataAccessor.getInstance().getCountry(
    dataFilters,
    applied,
  );
  return String(country?.label ?? '');
}

export function getKpiLabel(
  dataFilters: FilterDataStructure,
  applied: FilterForm,
): string {
  const kpi = FilterDataAccessor.getInstance().getKpi(dataFilters, applied);
  return String(kpi?.label ?? '');
}

function getBrandLevelFieldsForKpi(kpi: string): (keyof FilterForm)[] {
  return (
    PAGE_TITLE_BRAND_LEVEL_FIELDS_BY_KPI[kpi] ?? DEFAULT_BRAND_LEVEL_FIELDS
  );
}

export function getBrandLevelLabel(applied: FilterForm, kpi?: string): string {
  const fields = kpi
    ? getBrandLevelFieldsForKpi(kpi)
    : DEFAULT_BRAND_LEVEL_FIELDS;

  for (const field of fields) {
    const value = applied[field];
    if (value != null && value !== ALL_LABEL) {
      return String(value);
    }
  }

  return '';
}

export function getPageTitleByKpi(
  dataFilters: FilterDataStructure,
  applied: FilterForm,
): string {
  const countryLabel = getCountryLabel(dataFilters, applied);
  if (!countryLabel) {
    return '';
  }

  const kpiLabel = getKpiLabel(dataFilters, applied);
  const kpiKey = (applied.kpis as string) ?? '';

  const brandLevelLabel = getBrandLevelLabel(applied, kpiKey);

  if (brandLevelLabel) {
    return `${countryLabel} ${brandLevelLabel} ${kpiLabel}`;
  }

  return `${countryLabel} ${kpiLabel}`;
}
