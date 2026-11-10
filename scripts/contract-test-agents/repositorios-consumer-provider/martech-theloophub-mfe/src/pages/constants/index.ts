import { CaptionItem } from 'components';
import type { KpiGroup } from 'domain/Kpi';
import { SharedKpis } from 'pages/enums';
import { theme } from 'theme';

import { ChartKpiConfig } from '../types';

type FiltersApiParams = Record<string, boolean | string | number>;

export const INDIA_COUNTRY_CODE = 'IND';
export const UGANDA_COUNTRY_CODE = 'UGA';

export const defaultBarsThickness = [32, null, 56];
export const overviewPowerBarsThickness = [32, 56, 56];

export const brandPowerBookFiltersList = [
  'zones',
  'country',
  'time_frame',
  'brand_power_book_scopes',
  'segments',
  'portfolio',
  'global_brands',
];

export const brandPowerBookVisibleFilters = [
  'zone',
  'country',
  'scopes',
  'sub_scopes',
  'time_frame',
];

export const brandAnalysisKpiConfigs: Record<string, ChartKpiConfig> = {
  volume: {
    key: 'volume',
    shouldApplyConfigs: true,
    kpiName: SharedKpis.VOLUME_FORMATTER_KPI.id,
    barsThickness: defaultBarsThickness,
    chartType: {
      total_per_year_full: 'bar',
      total_per_month_quarter: 'line',
      total_per_year: 'bar',
    },
    jsonataFormatter: {
      volume: SharedKpis.VOLUME_FORMATTER_KPI.formatter,
    },
    tooltip: {
      content: 'PortfolioBrand.Overview.kpis.volume.tooltip',
      source: 'sunlight',
      refresh: 'monthly',
    },
    title: 'PortfolioBrand.Overview.kpis.volume.title',
    measure: 'PortfolioBrand.Overview.kpis.volume.measure',
    kpiGroup: 'volume',
    dateRefreshKey: 'month',
  },
  nr: {
    key: 'nr',
    shouldApplyConfigs: true,
    kpiName: SharedKpis.NR,
    barsThickness: defaultBarsThickness,
    chartType: {
      total_per_year_full: 'bar',
      total_per_month_quarter: 'line',
      total_per_year: 'bar',
    },
    tooltip: {
      content: 'PortfolioBrand.Overview.kpis.nr.tooltip',
      source: 'sunlight',
      refresh: 'monthly',
    },
    title: 'PortfolioBrand.Overview.kpis.nr.title',
    kpiGroup: 'finance',
    dateRefreshKey: 'month',
  },
  cores: {
    key: 'cores',
    shouldApplyConfigs: true,
    kpiName: SharedKpis.CORES,
    barsThickness: defaultBarsThickness,
    chartType: {
      total_per_year_full: 'bar',
      total_per_month_quarter: 'line',
      total_per_year: 'bar',
    },
    tooltip: {
      content: 'PortfolioBrand.Overview.kpis.cores.tooltip',
      source: 'sunlight',
      refresh: 'monthly',
    },
    title: 'PortfolioBrand.Overview.kpis.cores.title',
    kpiGroup: 'finance',
    dateRefreshKey: 'month',
  },
  market_share: {
    key: 'market_share',
    shouldApplyConfigs: true,
    kpiName: SharedKpis.MARKET_SHARE_FORMATTER_KPI.id,
    barsThickness: defaultBarsThickness,
    chartType: {
      total_per_year_full: 'bar',
      total_per_month_quarter: 'line',
      total_per_year: 'bar',
    },
    tooltip: {
      content: 'PortfolioBrand.Overview.kpis.market_share.tooltip',
      source: 'anaplan',
      refresh: 'monthly',
    },
    title: 'PortfolioBrand.Overview.kpis.market_share.title',
    measure: 'PortfolioBrand.Overview.kpis.market_share.measure',
    kpiGroup: 'market_share',
    dateRefreshKey: 'month',
    jsonataFormatter: {
      market_share: SharedKpis.MARKET_SHARE_FORMATTER_KPI.formatter,
    },
  },
  power: {
    key: 'power',
    shouldApplyConfigs: true,
    kpiName: SharedKpis.POWER,
    barsThickness: overviewPowerBarsThickness,
    chartType: {
      total_per_year_full: 'bar',
      total_per_month_quarter: 'bar',
      total_per_year: 'bar',
    },
    tooltip: {
      content: 'PortfolioBrand.Overview.kpis.power.tooltip',
      source: 'kantar',
      refresh: 'quarterly',
    },
    title: 'PortfolioBrand.Overview.kpis.power.title',
    kpiGroup: 'power',
    dateRefreshKey: 'quarter',
  },
};

export const LEGEND_CONFIG: CaptionItem[] = [
  {
    label: 'Megabrands',
    color: theme.colors.charts.bg.categories.primary.yellow,
    fontWeight: 'bold',
  },
  {
    label: 'Expansion',
    color: theme.colors.charts.bg.categories.primary.magenta,
    fontWeight: 'bold',
  },
  {
    label: 'Sustain',
    color: theme.colors.charts.bg.categories.primary.blue,
    fontWeight: 'bold',
  },
  {
    label: 'Tail',
    color: theme.colors.charts.bg.categories.primary.purple,
    fontWeight: 'bold',
  },
];

export const KPI_GROUPS: Record<string, KpiGroup> = {
  finance: 'finance',
  volume: 'volume',
  market_share: 'market_share',
  power: 'power',
  cores: 'finance',
  nr: 'finance',
};

export const PORTFOLIOS_TYPES = {
  MEGABRANDS: 'megabrands',
  EXPANSION: 'expansion',
  SUSTAIN: 'sustain',
  TAIL: 'tail',
};

export const AI_SUMMARY_PAGE_IDENTIFIERS = {
  VALUE_CREATION_HOME: '7. Value Creation; Home',
  GROW_THE_CATEGORY: '1. Category; POS Book; Grow the category',
  LEAD_THE_CATEGORY: '1. Category; POS Book; Lead the Category',
  RESOURCE_ALLOCATION_OVERVIEW: '5. Connections & Creativity; Overview',
  INNOVATION_OVERVIEW: '4. Innovation; Innovation; Overview',
  BEES_DISTRIBUTION_OVERVIEW: '6. Trade Execution; BEES Distribution; Overview',
  BRAND_ANALYSIS_OVERVIEW: '3. Portfolio and brand; Brand Analysis; Overview',
  BRAND_POWER_BOOK_OVERVIEW:
    '3. Portfolio and brand; Brand Power Book; Overview',
  PORTFOLIO_PERFORMANCE_OVERVIEW:
    '7. Value Creation; Portfolio Performance; Overview',
  INNOVATION_HOME_PB_VOLUME:
    '4. Innovation; Innovation; Performance_Breakdown_Volume',
  INNOVATION_HOME_PB_NETREVENUE:
    '4. Innovation; Innovation; Performance_Breakdown_NetRevenue',
  CONSUMER_HOME_ABI_LOVERS: '2. Consumer; Home; ABI Lovers',
  CONSUMER_HOME_PARTICIPATION: '2. Consumer; Home; Increase Participation',
  PERFORMANCE_TOOL_BRAND_POWER_DRILLDOWN:
    '7. Value Creation; Performance Tool; Brand Power',
  PERFORMANCE_TOOL_CORES_DRILLDOWN:
    '7. Value Creation; Performance Tool; CORES',
  PERFORMANCE_TOOL_MARKET_SHARE_DRILLDOWN:
    '7. Value Creation; Performance Tool; Market Share',
  PERFORMANCE_TOOL_NET_REVENUE_DRILLDOWN:
    '7. Value Creation; Performance Tool; nr',
  PERFORMANCE_TOOL_VOLUME_DRILLDOWN:
    '7. Value Creation; Performance Tool; Volume',
};

export const DEFAULT_CHART_COLORS = {
  TrendingUp: '#3CA91E',
  TrendingDown: '#D62222',
};

export const PDF_DEFAULT_CONFIG = {
  scale: 1.5,
  format: 'a4' as const,
  orientation: 'landscape' as const,
  margin: 0,
  preserveLinks: true,
  quality: 1,
  imageFormat: 'JPEG' as const,
  compression: true,
};
