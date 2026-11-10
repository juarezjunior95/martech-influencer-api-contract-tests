import { FilterConfig } from '../types';
import { audienceTargetingBrandsCompFilterConfig } from './audienceTargetingBrandsCompFilter';
import { audienceTargetingBrandsFilterConfig } from './audienceTargetingBrandsFilter';
import { beerPriceSegmentFilterConfig } from './beerPriceSegmentFilter';
import { brandFilterGroupingsFilterConfig } from './brandFilterGroupingsFilter';
import { brandPowerBookScopesFilterConfig } from './brandPowerBookScopesFilter';
import { brandPowerBookSubScopesFilterConfig } from './brandPowerBookSubScopesFilter';
import { brandsAbiFilterConfig } from './brandsAbiFilter';
import { brandsCompFilterConfig } from './brandsCompFilter';
import { brandsFilterConfig } from './brandsFilter';
import { countryFilterConfig } from './countryFilter';
import { distributionScopesFilterConfig } from './distributionScopesFilter';
import { globalBrandsFilterConfig } from './globalBrandsFilter';
import { growthLeversFilterConfig } from './growthLeversFilter';
import { kpisFilterConfig } from './kpisFilter';
import { periodsFilterConfig } from './periodsFilter';
import { portfoliosFilterConfig } from './portfoliosFilter';
import { posPeriodsFilterConfig } from './posPeriodsFilter';
import { productScopeFilterConfig } from './productScopeFilter';
import { segmentsFilterConfig } from './segmentsFilter';
import { subBrandsFilterConfig } from './subBrandsFilter';
import { timeFrameFilterConfig } from './timeFrameFilter';
import { valueCreationGrowthLeversFilter } from './valueCreationGrowthLeversFilter';
import { yearsFilterConfig } from './yearsFilter';
import { ytdMonthFilterConfig } from './ytdMonthFilter';
import { zonesFilterConfig } from './zonesFilter';

/**
 * All filter configurations
 * Ordered by processing priority
 */
export const filterConfigs: FilterConfig[] = [
  kpisFilterConfig,
  portfoliosFilterConfig,
  growthLeversFilterConfig,
  valueCreationGrowthLeversFilter,
  beerPriceSegmentFilterConfig,
  globalBrandsFilterConfig,
  brandFilterGroupingsFilterConfig,
  timeFrameFilterConfig,
  yearsFilterConfig,
  ytdMonthFilterConfig,
  posPeriodsFilterConfig,
  periodsFilterConfig,
  zonesFilterConfig,
  countryFilterConfig,
  segmentsFilterConfig,
  productScopeFilterConfig,
  brandsFilterConfig,
  subBrandsFilterConfig,
  brandsAbiFilterConfig,
  brandsCompFilterConfig,
  brandPowerBookScopesFilterConfig,
  brandPowerBookSubScopesFilterConfig,
  audienceTargetingBrandsFilterConfig,
  audienceTargetingBrandsCompFilterConfig,
  distributionScopesFilterConfig,
];

export * from './audienceTargetingBrandsCompFilter';
export * from './audienceTargetingBrandsFilter';
export * from './beerPriceSegmentFilter';
export * from './brandPowerBookScopesFilter';
export * from './brandPowerBookSubScopesFilter';
export * from './brandsAbiFilter';
export * from './brandsCompFilter';
export * from './brandsFilter';
export * from './countryFilter';
export * from './distributionScopesFilter';
export * from './globalBrandsFilter';
export * from './growthLeversFilter';
export * from './productScopeFilter';
export * from './segmentsFilter';
export * from './subBrandsFilter';
export * from './timeFrameFilter';
export * from './yearsFilter';
export * from './ytdMonthFilter';
export * from './zonesFilter';
