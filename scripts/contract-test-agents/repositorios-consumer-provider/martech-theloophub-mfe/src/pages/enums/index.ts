// CMS jsonata formatters were removed (see plan jira_refinement_cms_decommission).
// The string identifiers below are kept to satisfy existing imports across the
// codebase; the `formatter` / `formatters` fields are now empty objects/strings
// because no client-side jsonata transformation is required when consuming the
// BFF.

const EMPTY_FORMATTER = '';
const EMPTY_FORMATTERS = {} as Record<string, string>;

const AudienceTargetingKpis = {
  BRAND_AUDIENCES_CARDS: {
    id: 'owr_audience-targeting_audience-cards',
    kpiGroup: 'pos',
    formatters: EMPTY_FORMATTERS,
  },
  BRAND_AUDIENCES_BIG_NUMBER_PARTICIPATION: {
    id: 'owr_audience-targeting_big-numbers_participation',
    kpiGroup: 'pos',
    formatters: EMPTY_FORMATTERS,
  },
  BRAND_AUDIENCES_BIG_NUMBER_POWER: {
    id: 'owr_audience-targeting_big-numbers_power',
    kpiGroup: 'power',
    formatters: EMPTY_FORMATTERS,
  },
  BRAND_AUDIENCES_TABLE: {
    id: 'owr_audience-targeting_table',
    kpiGroup: 'pos',
    formatters: EMPTY_FORMATTERS,
  },
};

const BrandAnalysisKpis = {
  VOLUME: 'owr_brand-analysis_volume_chart',
  NR: 'owr_brand-analysis_nr_chart',
  CORES: 'owr_brand-analysis_cores_chart',
  POWER: 'owr_brand-analysis_brand_power_chart',
  VOLUME_FORMATTED: 'owr_brand-analysis_volume_chart_jsonata',
  NR_FORMATTED: 'owr_brand-analysis_nr_chart_jsonata',
  CORES_FORMATTED: 'owr_brand-analysis_cores_chart_jsonata',
  MARKET_SHARE_FORMATTED: 'owr_brand-analysis_market_share_chart_jsonata',
  POWER_FORMATTED: 'owr_brand-analysis_brand_power_chart_jsonata',

  VOLUME_FORMATTER_KPI: {
    id: 'owr_brand-analysis_volume_chart_jsonata',
    formatter: EMPTY_FORMATTER,
  },
  NR_FORMATTER_KPI: {
    id: 'owr_brand-analysis_nr_chart_jsonata',
    formatter: EMPTY_FORMATTER,
  },
  CORES_FORMATTER_KPI: {
    id: 'owr_brand-analysis_cores_chart_jsonata',
    formatter: EMPTY_FORMATTER,
  },
  MARKET_SHARE_FORMATTER_KPI: {
    id: 'owr_brand-analysis_market_share_chart_jsonata',
    formatter: EMPTY_FORMATTER,
  },
  POWER_FORMATTER_KPI: {
    id: 'owr_brand-analysis_brand_power_chart_jsonata',
    idPower: 'owr_brand-analysis_brand-power_brand-power_jsonata',
    formatter: EMPTY_FORMATTER,
  },
} as const;

const InvestmentBreakdownKpis = {
  INVESTMENT_BREAKDOWN_TABLE:
    'owr_resource-allocation_investment-breakdown_table',
} as const;

const brandPowerBookKpis = {
  PERFORMANCE_TREND: {
    id: 'owr_brand-power-book_power-performance-trend_by-year-power-ac_trend-over-time',
    kpiGroup: 'power',
    formatters: EMPTY_FORMATTERS,
    brandPowerBookExportFormatters: EMPTY_FORMATTERS,
  },
  BIG_NUMBERS: {
    id: 'owr_brand-power-book_big-numbers',
    formatters: EMPTY_FORMATTERS,
    brandPowerBookExportFormatters: EMPTY_FORMATTERS,
  },
  ZONE_PERFORMANCE: {
    id: 'owr_brand-power-book_performance-breadown_by-zone',
    formatters: EMPTY_FORMATTERS,
    brandPowerBookExportFormatters: EMPTY_FORMATTERS,
  },
  PERFORMANCE_DETAILS: {
    id: 'owr_brand-power-book_performance-breadown_by-zone-maturity-performance-details',
    formatters: EMPTY_FORMATTERS,
    brandPowerBookExportFormatters: EMPTY_FORMATTERS,
  },
  MATURITY_PERFORMANCE: {
    id: 'owr_brand-power-book_performance-breadown_by-maturity',
    formatters: EMPTY_FORMATTERS,
    brandPowerBookExportFormatters: EMPTY_FORMATTERS,
  },
  COUNTRY_CONTRIBUTION: {
    id: 'owr_brand-power-book_performance-breadown_by-top-countries-contribution',
    formatters: EMPTY_FORMATTERS,
    brandPowerBookExportFormatters: EMPTY_FORMATTERS,
  },
  SEGMENT_PERFORMANCE: {
    id: 'owr_brand-power-book_summary-power_by-segment-performance',
    formatters: EMPTY_FORMATTERS,
  },
  PORTFOLIO_PERFORMANCE_BOOK: {
    id: 'owr_brand-power-book_summary-power_by-portifolio-performance',
    formatters: EMPTY_FORMATTERS,
  },
  BRAND_BREAKDOWN: {
    id: 'owr_brand-power-book_summary-power_by-brand-breakdown',
    formatters: EMPTY_FORMATTERS,
    brandPowerBookExportFormatters: EMPTY_FORMATTERS,
  },
  POWER_BOOK_INSIGHTS: {
    id: 'owr_power-book-export_insights',
    formatters: EMPTY_FORMATTERS,
  },
  BFF: {
    OVERVIEW: 'portfolio-brand_brand-power-book_overview_power-book-overview',
    ZONE_MATURITY:
      'portfolio-brand_brand-power-book_overview_performance-breakdown_zone-maturity',
    ZONE_MATURITY_DETAILS:
      'portfolio-brand_brand-power-book_overview_performance-breakdown_zone-maturity-details',
    SUMMARY_FOR_POWER:
      'portfolio-brand_brand-power-book_overview_summary_summary-power',
    SUMMARY_FOR_POWER_BREAKDOWN:
      'portfolio-brand_brand-power-book_overview_summary_summary-breakdown',
    COUNTRY_CONTRIBUTION:
      'portfolio-brand_brand-power-book_overview_top-countries-contribution_countries-contribution',
  },
} as const;

const PowerBookExportKpisBff = {
  GLOBAL: {
    ZONE_PERFORMANCE:
      'portfolio-brand_brand-power-book-export_global_zone-performance',
    BIG_NUMBERS: 'portfolio-brand_brand-power-book-export_global_big-numbers',
    ZONE_PERFORMANCE_DETAILS:
      'portfolio-brand_brand-power-book-export_global_zone-performance-details',
    TOP_COUNTRY_CONTRIBUTION:
      'portfolio-brand_brand-power-book-export_global_top-country-contribution',
    TREND_POWER_EVOLUTION:
      'portfolio-brand_brand-power-book-export_global_trend-power-evolution',
  },
  COUNTRY: {
    BRAND_BREAKDOWN:
      'portfolio-brand_brand-power-book-export_country_brand-breakdown',
  },
  INSIGHTS: 'portfolio-brand_brand-power-book-export_insights',
} as const;

const PortfolioPerformanceKpis = {
  CATEGORY_GROWTH_LEVERS: {
    id: 'owr_value-creation_overview_category-overview',
    formatters: EMPTY_FORMATTERS,
  },
  PORTFOLIO_PERFORMANCE: 'owr_value-creation_overview_portfolio-performance',
} as const;

const PnLKpis = {
  PNL_BRANDS: {
    id: 'owr_value-creation_pl_brand',
    formatters: EMPTY_FORMATTERS,
  },
} as const;

export const SharedKpis = {
  ...AudienceTargetingKpis,
  ...BrandAnalysisKpis,
  ...InvestmentBreakdownKpis,
  ...brandPowerBookKpis,
  ...PowerBookExportKpisBff,
  ...PortfolioPerformanceKpis,
  ...PnLKpis,
} as const;
