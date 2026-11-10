import type { FilterForm, FilterValue } from 'models/Filters';

export interface PerformanceToolSubFilters {
  page_filter: string;
  brand: string;
  sub_brand: string;
  growth_lever: string;
}

type DrillDownKpiSlug =
  | 'brand-power'
  | 'cores'
  | 'non-finance_market-share'
  | 'volume'
  | 'net-revenue';

const ALL = 'All';
const DRILL_DOWN_KPI_SLUGS = new Set<string>([
  'brand-power',
  'cores',
  'non-finance_market-share',
  'volume',
  'net-revenue',
]);

const getStringFilterValue = (
  applied: FilterForm,
  key: string,
  fallback = ALL,
): string => {
  const value = applied[key];

  return typeof value === 'string' ? value : fallback;
};

const isDrillDownKpiSlug = (value?: string): value is DrillDownKpiSlug =>
  typeof value === 'string' && DRILL_DOWN_KPI_SLUGS.has(value);

const getPageFilter = (applied: FilterForm): string => {
  const classification = getStringFilterValue(
    applied,
    'brand_filter_groupings',
  );
  const pageFilterKeyByClassification: Record<string, string> = {
    Portfolio: 'portfolios',
    'Beer Price Segment': 'beer_price_segment',
  };
  const pageFilterKey = pageFilterKeyByClassification[classification];

  return pageFilterKey ? getStringFilterValue(applied, pageFilterKey) : ALL;
};

const getBrand = (applied: FilterForm): string => {
  const classification = getStringFilterValue(
    applied,
    'brand_filter_groupings',
  );
  const brandFilterKeyByClassification: Record<string, string> = {
    'All Brands': 'brands',
    Portfolio: 'brands',
    'Beer Price Segment': 'brands',
    'Global Brands': 'global_brands',
  };
  const brandFilterKey = brandFilterKeyByClassification[classification];

  return brandFilterKey ? getStringFilterValue(applied, brandFilterKey) : ALL;
};

const getNormalizedKpiSlug = (
  applied: FilterForm,
  kpiSlug?: string,
): DrillDownKpiSlug => {
  if (isDrillDownKpiSlug(kpiSlug)) {
    return kpiSlug;
  }

  const appliedKpi = getStringFilterValue(applied, 'kpis', '');

  if (appliedKpi === 'power') {
    return 'brand-power';
  }

  return isDrillDownKpiSlug(appliedKpi) ? appliedKpi : 'volume';
};

const getAiSummaryPeriodFilters = (
  normalizedKpiSlug: DrillDownKpiSlug,
  periodValue: string,
  pageFilterValue: string,
  growthLever: string,
): Record<string, FilterValue> => {
  if (normalizedKpiSlug === 'brand-power') {
    return {
      period: periodValue,
      page_filter: pageFilterValue,
    };
  }

  if (normalizedKpiSlug === 'non-finance_market-share') {
    return {
      period: periodValue,
    };
  }

  return {
    page_filter: pageFilterValue,
    period_type: periodValue,
    growth_lever: growthLever,
  };
};

/**
 * Builds the subFilters object for PerformanceTool BFF requests.
 * Centralizes the logic for page_filter, brand, and sub_brand considering
 * brand_filter_groupings (Portfolio, Beer Price Segment, Global Brands, All Brands)
 * and subBrands selection.
 */
export function getPerformanceToolSubFilters(
  applied: FilterForm,
  overrides?: Partial<PerformanceToolSubFilters>,
): PerformanceToolSubFilters {
  return {
    page_filter: overrides?.page_filter ?? getPageFilter(applied),
    brand: overrides?.brand ?? getBrand(applied),
    sub_brand:
      overrides?.sub_brand ?? getStringFilterValue(applied, 'sub_brands'),
    growth_lever:
      overrides?.growth_lever ?? getStringFilterValue(applied, 'growth_levers'),
  };
}

export function getAiSummaryFilters(
  applied: FilterForm,
  kpiSlug?: string,
): Record<string, FilterValue> {
  const sf = getPerformanceToolSubFilters(applied);
  const periodValue = getStringFilterValue(applied, 'periods', 'YTD');
  const normalizedKpiSlug = getNormalizedKpiSlug(applied, kpiSlug);

  const pageFilterValue = sf.page_filter ?? ALL;
  const brandValue = sf.brand;
  const subBrandValue = sf.sub_brand ?? ALL;
  const countryValue = applied.country;

  const growthLeverForInsight = sf.growth_lever;

  const defaultFilters = {
    country: countryValue,
    brand: brandValue,
    sub_brand: subBrandValue,
    viewtype: '',
  };

  return {
    ...defaultFilters,
    ...getAiSummaryPeriodFilters(
      normalizedKpiSlug,
      periodValue,
      pageFilterValue,
      growthLeverForInsight,
    ),
  };
}
