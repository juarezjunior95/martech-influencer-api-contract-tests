import { UnifiedSlideConfig } from '../types';

export const pageSections = {
  cover: 'cover',
  ttAbiExecutiveSummaryInsights: 'tt-abi-executive-summary-insights',
  totalAbiPowerEvolution: 'total-abi-power-evolution',
  totalAbiPowerByCountry: 'total-abi-power-by-country',

  megabrandsPowerEvolution: 'megabrands-power-evolution',
  megabrandsPowerByCountry: 'megabrands-power-by-country',

  ttAbiMegabrandsPowerGrowthContribution:
    'tt-abi-megabrands-power-growth-contribution',

  segmentsCover: 'segments-cover',
  mainstreamPowerByCountry: 'mainstream-power-by-country',
  corePowerByCountry: 'core-power-by-country',
  premiumizationPowerByCountry: 'premiumization-power-by-country',

  coverMegabrands: 'cover-megabrands',
  megabrandsPerformance: 'megabrands-performance',
  expansionPerformance: 'expansion-performance',
  sustainPerformance: 'sustain-performance',
  tailPerformance: 'tail-performance',

  coverGlobalBrands: 'cover-global-brands',
  globalBrandsPerformance: 'global-brands-performance',
  coronaPerformance: 'corona-performance',
  budweiserPerformance: 'budweiser-performance',
  michelobUltraPerformance: 'michelob-ultra-performance',
  stellaArtoisPerformance: 'stella-artois-performance',
  heinekenPerformance: 'heineken-performance',

  // Country Pages
  countryExecutiveSummaryInsights: 'country-executive-summary-insights',
  countryTrends: 'country-trends',
  countryPerformance: 'country-performance',
  countryCompetitorPerformance: 'country-competitor-performance',

  backCover: 'back-cover',
};

export const UNIFIED_GLOBAL_SLIDES: readonly UnifiedSlideConfig[] = [
  {
    type: 'executive-summary',
    section: pageSections.ttAbiExecutiveSummaryInsights,
  },

  {
    type: 'evolution',
    section: pageSections.totalAbiPowerEvolution,
    title: 'Total ABI Power Evolution',
    dataKey: 'global',
    insightsPath: 'evolution.ABI.insights',
  },

  {
    type: 'by-country',
    section: pageSections.totalAbiPowerByCountry,
    title: 'Total ABI Power by Country',
    dataKey: 'global',
    insightsPath: 'by_country.ABI.insights',
  },

  {
    type: 'evolution',
    section: pageSections.megabrandsPowerEvolution,
    title: 'Megabrands Power Evolution',
    dataKey: 'megabrands',
    insightsPath: 'evolution.ABI.Megabrands.insights',
    portfolioType: 'MEGABRANDS',
  },

  {
    type: 'by-country',
    section: pageSections.megabrandsPowerByCountry,
    title: 'Megabrands Power by Country',
    dataKey: 'megabrands',
    insightsPath: 'by_country.Portfolio.Megabrands.Zones.insights',
  },

  {
    type: 'contribution',
    section: pageSections.ttAbiMegabrandsPowerGrowthContribution,
    title: 'TT ABI and Megabrands Power Growth Contribution',
  },

  {
    type: 'cover',
    section: pageSections.segmentsCover,
    category: 'One Way Reports',
    name: 'Segments',
  },

  {
    type: 'performance',
    section: pageSections.mainstreamPowerByCountry,
    title: 'Mainstream Power by Country',
    dataKey: 'mainstream',
    insightsPath: 'by_country.Segments.Mainstream.Maturity.insights',
  },
  {
    type: 'performance',
    section: pageSections.corePowerByCountry,
    title: 'CORE+ Power by Country',
    dataKey: 'core',
    insightsPath: 'by_country.Segments.Core.Maturity.insights',
  },
  {
    type: 'performance',
    section: pageSections.premiumizationPowerByCountry,
    title: 'Premium Power by Country',
    dataKey: 'premiumization',
    insightsPath: 'by_country.Segments.Premiumization.Maturity.insights',
  },

  {
    type: 'cover',
    section: pageSections.coverMegabrands,
    category: 'One Way Reports',
    name: 'Megabrands Deep Dive',
  },

  {
    type: 'performance',
    section: pageSections.megabrandsPerformance,
    title: 'Megabrands Power by Country',
    dataKey: 'megabrands',
    insightsPath: 'by_country.Portfolio.Megabrands.Maturity.insights',
  },
  {
    type: 'performance',
    section: pageSections.expansionPerformance,
    title: 'Expansion Power by Country',
    dataKey: 'expansion',
    insightsPath: 'by_country.Portfolio.Expansion.Maturity.insights',
  },
  {
    type: 'performance',
    section: pageSections.sustainPerformance,
    title: 'Sustain Power by Country',
    dataKey: 'sustain',
    insightsPath: 'by_country.Portfolio.Sustain.Maturity.insights',
  },
  {
    type: 'performance',
    section: pageSections.tailPerformance,
    title: 'Tail Power by Country',
    dataKey: 'tail',
    insightsPath: 'by_country.Portfolio.Tail.Maturity.insights',
  },

  {
    type: 'cover',
    section: pageSections.coverGlobalBrands,
    category: 'One Way Reports',
    name: 'Global Brands Deep Dive',
  },

  {
    type: 'performance',
    section: pageSections.globalBrandsPerformance,
    title: 'Global Brands Power by Country',
    dataKey: 'globalBrands',
    insightsPath:
      'by_country.global_brands.all_global_brands.Maturity.insights',
  },
  {
    type: 'performance',
    section: pageSections.coronaPerformance,
    title: 'Corona Power by Country',
    dataKey: 'corona',
    insightsPath: 'by_country.global_brands.Corona.Maturity.insights',
  },
  {
    type: 'performance',
    section: pageSections.budweiserPerformance,
    title: 'Budweiser Power by Country',
    dataKey: 'budweiser',
    insightsPath: 'by_country.global_brands.Budweiser.Maturity.insights',
  },
  {
    type: 'performance',
    section: pageSections.michelobUltraPerformance,
    title: 'Michelob Ultra Power by Country',
    dataKey: 'michelobUltra',
    insightsPath: 'by_country.global_brands.michelob_ultra.Maturity.insights',
  },
  {
    type: 'performance',
    section: pageSections.stellaArtoisPerformance,
    title: 'Stella Artois Power by Country',
    dataKey: 'stellaArtois',
    insightsPath: 'by_country.global_brands.stella_artois.Maturity.insights',
  },
  {
    type: 'performance',
    section: pageSections.heinekenPerformance,
    title: 'Heineken Power by Country',
    dataKey: 'heineken',
    insightsPath: 'by_country.global_brands.Heineken.Maturity.insights',
    isCompetitor: true,
  },
] as const;

export const AI_SUMMARY_IDENTIFIER_BASE =
  '3. Portfolio and brand; Brand Power Book Export;';

export const AI_SUMMARY_GLOBAL_IDENTIFIER: Record<
  string,
  { id: string; subFilters: Record<string, string> }
> = {
  'total-abi-power-evolution': {
    id: `${AI_SUMMARY_IDENTIFIER_BASE} Evolution Trend - All`,
    subFilters: {
      scope: 'All',
    },
  },
  'total-abi-power-by-country': {
    id: `${AI_SUMMARY_IDENTIFIER_BASE} All`,
    subFilters: {
      scope: 'All',
    },
  },
  'megabrands-power-evolution': {
    id: `${AI_SUMMARY_IDENTIFIER_BASE} Evolution Trend - Megabrands`,
    subFilters: {
      scope: 'Megabrands',
    },
  },
  'megabrands-power-by-country': {
    id: `${AI_SUMMARY_IDENTIFIER_BASE} Megabrands`,
    subFilters: {
      scope: 'Megabrands',
    },
  },
  'megabrands-performance': {
    id: `${AI_SUMMARY_IDENTIFIER_BASE} Megabrands`,
    subFilters: {
      scope: 'Megabrands',
    },
  },
  'tt-abi-megabrands-power-growth-contribution_megabrands': {
    id: `${AI_SUMMARY_IDENTIFIER_BASE} Top 10 - Megabrands`,
    subFilters: {
      scope: 'Megabrands',
    },
  },
  'tt-abi-megabrands-power-growth-contribution_all': {
    id: `${AI_SUMMARY_IDENTIFIER_BASE} Top 10 - All`,
    subFilters: {
      scope: 'All',
    },
  },
  'mainstream-power-by-country': {
    id: `${AI_SUMMARY_IDENTIFIER_BASE} Mainstream`,
    subFilters: {
      scope: 'Mainstream',
    },
  },
  'core-power-by-country': {
    id: `${AI_SUMMARY_IDENTIFIER_BASE} Core+`,
    subFilters: {
      scope: 'Core+',
    },
  },
  'premiumization-power-by-country': {
    id: `${AI_SUMMARY_IDENTIFIER_BASE} Premiumization`,
    subFilters: {
      scope: 'Premiumization',
    },
  },
  'expansion-performance': {
    id: `${AI_SUMMARY_IDENTIFIER_BASE} Expansion`,
    subFilters: {
      scope: 'Expansion',
    },
  },
  'sustain-performance': {
    id: `${AI_SUMMARY_IDENTIFIER_BASE} Sustain`,
    subFilters: {
      scope: 'Sustain',
    },
  },
  'tail-performance': {
    id: `${AI_SUMMARY_IDENTIFIER_BASE} Tail`,
    subFilters: {
      scope: 'Tail',
    },
  },
  'global-brands-performance': {
    id: `${AI_SUMMARY_IDENTIFIER_BASE} All Global Brands`,
    subFilters: {
      scope: 'All Global Brands',
    },
  },
  'corona-performance': {
    id: `${AI_SUMMARY_IDENTIFIER_BASE} Corona`,
    subFilters: {
      scope: 'Corona',
    },
  },
  'budweiser-performance': {
    id: `${AI_SUMMARY_IDENTIFIER_BASE} Budweiser`,
    subFilters: {
      scope: 'Budweiser',
    },
  },
  'michelob-ultra-performance': {
    id: `${AI_SUMMARY_IDENTIFIER_BASE} Michelob Ultra`,
    subFilters: {
      scope: 'Michelob Ultra',
    },
  },
  'stella-artois-performance': {
    id: `${AI_SUMMARY_IDENTIFIER_BASE} Stella Artois`,
    subFilters: {
      scope: 'Stella Artois',
    },
  },
  'heineken-performance': {
    id: `${AI_SUMMARY_IDENTIFIER_BASE} Heineken`,
    subFilters: {
      scope: 'Heineken',
    },
  },
};

export const AI_SUMMARY_COUNTRY_IDENTIFIER: Record<
  string,
  { id: string; subFilters: Record<string, string> }
> = {
  'power-evolution-all': {
    id: `${AI_SUMMARY_IDENTIFIER_BASE} Power Evolution`,
    subFilters: {
      scope: 'All',
    },
  },
  'power-evolution-megabrands': {
    id: `${AI_SUMMARY_IDENTIFIER_BASE} Power Evolution`,
    subFilters: {
      scope: 'Megabrands',
    },
  },
  'performance-abi': {
    id: `${AI_SUMMARY_IDENTIFIER_BASE} Performance`,
    subFilters: { scope: null },
  },
  'performance-competitor': {
    id: `${AI_SUMMARY_IDENTIFIER_BASE} Performance Competition`,
    subFilters: { scope: null },
  },
};
