export const pageSections = {
  cover: 'cover',
  sustainableGrowthOverview: 'sustainable-growth-overview',

  participationBreakdownByCohort: 'participation-breakdown-by-cohort',
  participationBreakdownByCohortManufacture:
    'participation-breakdown-by-cohort-manufacture',
  participationBreakdownByCohortChart:
    'participation-breakdown-by-cohort-chart',

  brandPower: 'brand-power',
  brandPowerBreakdown: 'brand-power-breakdown',
  brandPowerBreakdownComp: 'brand-power-breakdown-comp',

  volume: 'volume',
  volumeWaterfall: 'volume-waterfall',

  netRevenue: 'net-revenue',
  netRevenueWaterfall: 'net-revenue-waterfall',

  marketShare: 'market-share',
  marketShareWaterfall: 'market-share-waterfall',
  marketShareBrandsBreakdown: 'market-share-brands-breakdown',

  portfolioPerformance: 'portfolio-performance',

  sustainableGrowthOverviewLeadPremium:
    'sustainable-growth-overview-lead-premium',
  sustainableGrowthOverviewSuperiorCore:
    'sustainable-growth-overview-superior-core',
  sustainableGrowthOverviewBalancedChoices:
    'sustainable-growth-overview-balanced-choices',
  sustainableGrowthOverviewBeyondBeer:
    'sustainable-growth-overview-beyond-beer',

  pnlBrands: 'pnl-brands',
  pnlBrandsOutput: 'pnl-brands-output',

  resourceAllocationMediaOverview: 'resource-allocation-media-overview',
} as const;

export type VolumePagesCountryPprPageSectionKey = keyof typeof pageSections;

export interface SustainableGrowthOverviewByGrowthLeverSlideConfig {
  id: string;
  pageSectionKey: Exclude<
    VolumePagesCountryPprPageSectionKey,
    'cover' | 'sustainableGrowthOverview'
  >;
  growthLever: string;
  title: string;
}

export const SUSTAINABLE_GROWTH_OVERVIEW_BY_GROWTH_LEVER_SLIDES: Record<
  string,
  SustainableGrowthOverviewByGrowthLeverSlideConfig
> = {
  leadPremium: {
    id: 'lead-premium',
    pageSectionKey: 'sustainableGrowthOverviewLeadPremium',
    growthLever: 'Lead Premium',
    title: 'Sustainable Growth Overview by Lead Premium',
  },
  superiorCore: {
    id: 'superior-core',
    pageSectionKey: 'sustainableGrowthOverviewSuperiorCore',
    growthLever: 'Superior Core',
    title: 'Sustainable Growth Overview by Superior Core',
  },
  balancedChoices: {
    id: 'balanced-choices',
    pageSectionKey: 'sustainableGrowthOverviewBalancedChoices',
    growthLever: 'Balanced Choices',
    title: 'Sustainable Growth Overview by Balanced Choices',
  },
  beyondBeer: {
    id: 'beyond-beer',
    pageSectionKey: 'sustainableGrowthOverviewBeyondBeer',
    growthLever: 'Beyond Beer',
    title: 'Sustainable Growth Overview by Beyond Beer',
  },
};
