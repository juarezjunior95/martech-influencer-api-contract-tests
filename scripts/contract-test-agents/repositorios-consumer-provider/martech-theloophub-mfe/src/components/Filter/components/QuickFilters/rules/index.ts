import {
  AudienceTargetingBrandsCompQuickFilter,
  AudienceTargetingBrandsQuickFilter,
  BrandPowerBookScopesQuickFilter,
  BrandPowerBookSubScopesQuickFilter,
  BrandsAbiQuickFilter,
  BrandsCompQuickFilter,
  BrandsQuickFilter,
  ClassificationQuickFilter,
  CountryQuickFilter,
  DistributionScopesQuickFilter,
  GrowthLeversQuickFilter,
  KPIQuickFilter,
  PeriodsQuickFilter,
  PosPeriodsQuickFilter,
  ProductScopeQuickFilter,
  SegmentsQuickFilter,
  SubBrandsQuickFilter,
  TimeFrameQuickFilter,
  YearsQuickFilter,
  YtdMonthQuickFilter,
  ZoneQuickFilter,
} from 'components/Filter/components/Fields';
import { QuickFilterEngine } from 'domain/Filter';
import { FilterDataStructure } from 'models/Filters';

/**
 * Map of Quick Filter components
 */
export const QUICK_FILTERS_COMPONENTS = {
  zone: ZoneQuickFilter,
  country: CountryQuickFilter,
  years: YearsQuickFilter,
  segments: SegmentsQuickFilter,
  product_scope: ProductScopeQuickFilter,
  brand_filter_groupings: ClassificationQuickFilter,
  portfolios: ClassificationQuickFilter,
  beer_price_segment: ClassificationQuickFilter,
  growth_levers: GrowthLeversQuickFilter,
  value_creation_growth_levers: GrowthLeversQuickFilter,
  global_brands: BrandsQuickFilter,
  brands: BrandsQuickFilter,
  sub_brands: SubBrandsQuickFilter,
  audience_targeting_brands: AudienceTargetingBrandsQuickFilter,
  audience_targeting_brands_comp: AudienceTargetingBrandsCompQuickFilter,
  brands_abi: BrandsAbiQuickFilter,
  brands_comp: BrandsCompQuickFilter,
  pos_periods: PosPeriodsQuickFilter,
  periods: PeriodsQuickFilter,
  scopes: BrandPowerBookScopesQuickFilter,
  sub_scopes: BrandPowerBookSubScopesQuickFilter,
  distribution_scopes: DistributionScopesQuickFilter,
  kpis: KPIQuickFilter,
  'ytd-month': YtdMonthQuickFilter,
  time_frame: TimeFrameQuickFilter,
};

/**
 * Apply filter rules using the domain engine.
 * Returned fields keep the order of QUICK_FILTERS_COMPONENTS.
 */
export const applyFilterRules = (
  fields: string[],
  context: {
    pageName: string;
    appliedFilters: Record<string, string | number>;
    dataFilters?: FilterDataStructure;
  },
): string[] => {
  const engine = QuickFilterEngine.getInstance(
    Object.keys(QUICK_FILTERS_COMPONENTS),
  );
  const filteredFields = engine.filterFields(fields, context);
  const orderedKeys = Object.keys(QUICK_FILTERS_COMPONENTS);

  return orderedKeys.filter((key) => filteredFields.includes(key));
};
