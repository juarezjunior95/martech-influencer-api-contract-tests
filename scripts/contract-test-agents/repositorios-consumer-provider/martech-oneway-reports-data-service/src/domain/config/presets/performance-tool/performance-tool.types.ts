/**
 * Performance Tool preset types, filter contracts, and datasource identifiers.
 *
 * Filter layering:
 * 1. Base — shared by every KPI (finance and non-finance)
 * 2. Finance / non-finance — base plus domain-specific filters
 * 3. Component extras — declared only when a datasource needs them
 */

/**
 * Raw row from {@link PERFORMANCE_TOOL_FILTER_QUERY} /
 * Raw row returned by the `owr_result_query_sp` stored procedure for
 * {@link PERFORMANCE_TOOL_FILTER_SP_NAME}, sourced from
 * `gold_common.owr_kpis_filter_performance_tool_lk` (Drupal
 * `filter_performance-tool-kpis`).
 */
export interface PerformanceToolFilterRawRow {
  KPI_NAME: string;
  ABI_ZONE: string;
  COUNTRY_ISO_CODE_3: string;
  RAW_GEOGRAPHY: string;
  RAW_BRAND: string;
  SEGMENT: string;
  PERIOD: string;
  SUBBRAND: string;
  GROWTHLEVER: string;
  GLOBALBRAND: string;
  PRICE_TIER: string;
  REGION: string;
}

export interface PerformanceToolOption {
  label: string;
  value: string;
}

export interface PerformanceToolDimensionConfig<
  T extends PerformanceToolOption = PerformanceToolOption,
> {
  values: T[];
  default: T;
}

export interface PerformanceToolKpiConfig {
  label: string;
  value: string;
  periods: readonly string[];
  group: string;
  brands_classification: string[];
  growth_levers_classification: string[];
  cloneOf?: string;
  weight_type?: readonly PerformanceToolOption[];
  timePeriod?: boolean;
}

export interface PerformanceToolPeriodOption {
  value: string;
  label: string;
  full: string;
}

export type PerformanceToolTimePeriodType =
  | "YTD"
  | "HALF"
  | "QTR"
  | "R3M"
  | "MTH"
  | "FY";

export interface PerformanceToolTimePeriodOption {
  value: PerformanceToolTimePeriodType;
  label: string;
}

export interface PerformanceToolTimePeriodConfig {
  values: PerformanceToolTimePeriodOption[];
  default: PerformanceToolTimePeriodOption;
  max_dt_end: string;
  default_dt_end: string;
}

/**
 * Top-level JSON from Drupal {@link PerformanceToolDto} (jsonSerialize).
 */
export type PerformanceToolPresetValue = Record<string, unknown>;

export const PERFORMANCE_TOOL_DATASET_ID = "performance-tool-kpis";

/** Resolves to `src/infrastructure/sql/databricks/presets/performance-tool-kpis.sql`. */
export const PERFORMANCE_TOOL_FILTER_QUERY = "presets/performance-tool-kpis";

/** Dataset identifier for the volume line-chart drill-down datasource. */
export const PERFORMANCE_TOOL_VOLUME_LINE_CHART_DATASET_ID =
  "performance_tool_finance_line_chart";

/** Dataset identifier for the volume bar-chart drill-down datasource. */
export const PERFORMANCE_TOOL_VOLUME_BAR_CHART_DATASET_ID =
  "performance_tool_finance_bar_chart";

/** Dataset identifier for the volume contribution-waterfall drill-down datasource. */
export const PERFORMANCE_TOOL_VOLUME_WATERFALL_DATASET_ID =
  "performance_tool_finance_waterfall";

/** Stored procedure name for the volume line-chart drill-down datasource. */
export const PERFORMANCE_TOOL_VOLUME_LINE_CHART_SP_NAME =
  "7_value_creation_performance-tool_volume_line-chart";

/** Stored procedure name for the volume bar-chart drill-down datasource. */
export const PERFORMANCE_TOOL_VOLUME_BAR_CHART_SP_NAME =
  "7_value_creation_performance-tool_volume_bar-chart";

/** Stored procedure name for the volume contribution-waterfall drill-down datasource. */
export const PERFORMANCE_TOOL_VOLUME_WATERFALL_SP_NAME =
  "7_value_creation_performance-tool_volume_waterfall";

/** Dataset identifier shared by finance big-numbers drill-down datasources. */
export const PERFORMANCE_TOOL_FINANCE_BIG_NUMBERS_DATASET_ID =
  "performance_tool_finance_big_numbers";

/** Dataset identifier for the volume big-numbers drill-down datasource. */
export const PERFORMANCE_TOOL_VOLUME_BIG_NUMBERS_DATASET_ID =
  PERFORMANCE_TOOL_FINANCE_BIG_NUMBERS_DATASET_ID;

/** Stored procedure name for the volume big-numbers drill-down datasource. */
export const PERFORMANCE_TOOL_VOLUME_BIG_NUMBERS_SP_NAME =
  "7_value_creation_performance-tool_volume_big-numbers";

/** Dataset identifier for the market-share update-status drill-down datasource. */
export const PERFORMANCE_TOOL_MARKET_SHARE_UPDATE_STATUS_DATASET_ID =
  "performance_tool_market_share_update_status";

/** Stored procedure name for the market-share update-status drill-down datasource. */
export const PERFORMANCE_TOOL_MARKET_SHARE_UPDATE_STATUS_SP_NAME =
  "7_value_creation_performance-tool_market-share_update-status";
/** Stored procedure name for the CORES big-numbers drill-down datasource. */

/** Stored procedure name for the CORES big-numbers drill-down datasource. */
export const PERFORMANCE_TOOL_CORES_BIG_NUMBERS_SP_NAME =
  "7_value_creation_performance-tool_cores_big-numbers";

/** Dataset identifier for the market-share waterfall/table drill-down datasource. */
export const PERFORMANCE_TOOL_MARKET_SHARE_WATERFALL_DATASET_ID =
  "performance_tool_market_share_waterfall";

/** Stored procedure name for the market-share waterfall/table drill-down datasource. */
export const PERFORMANCE_TOOL_MARKET_SHARE_WATERFALL_SP_NAME =
  "7_value_creation_performance-tool_market-share_waterfall";

/** Dataset identifier for the net-revenue big-numbers drill-down datasource. */
export const PERFORMANCE_TOOL_NET_REVENUE_BIG_NUMBERS_DATASET_ID =
  PERFORMANCE_TOOL_FINANCE_BIG_NUMBERS_DATASET_ID;

/** Stored procedure name for the net-revenue big-numbers drill-down datasource. */
export const PERFORMANCE_TOOL_NET_REVENUE_BIG_NUMBERS_SP_NAME =
  "7_value_creation_performance-tool_net-revenue_big-numbers";

/** Dataset identifier for the net-revenue contribution-waterfall datasource. */
export const PERFORMANCE_TOOL_NET_REVENUE_WATERFALL_DATASET_ID =
  "performance_tool_finance_nr_waterfall";

/** Stored procedure registry name for the dedicated Net Revenue waterfall function. */
export const PERFORMANCE_TOOL_NET_REVENUE_WATERFALL_SP_NAME =
  "7_value_creation_performance-tool_net-revenue_waterfall";

/** Dataset identifier for the net-revenue line-chart drill-down datasource. */
export const PERFORMANCE_TOOL_NET_REVENUE_LINE_CHART_DATASET_ID =
  "performance_tool_finance_line_chart";

/** Dataset identifier for the net-revenue bar-chart drill-down datasource. */
export const PERFORMANCE_TOOL_NET_REVENUE_BAR_CHART_DATASET_ID =
  "performance_tool_finance_bar_chart";

/** Stored procedure name for the net-revenue line-chart drill-down datasource. */
export const PERFORMANCE_TOOL_NET_REVENUE_LINE_CHART_SP_NAME =
  "7_value_creation_performance-tool_net-revenue_line-chart";

/** Stored procedure name for the net-revenue bar-chart drill-down datasource. */
export const PERFORMANCE_TOOL_NET_REVENUE_BAR_CHART_SP_NAME =
  "7_value_creation_performance-tool_net-revenue_bar-chart";

/** Stored procedure name for the market-share line-chart drill-down datasource. */
export const PERFORMANCE_TOOL_MARKET_SHARE_LINE_CHART_SP_NAME =
  "7_value_creation_performance-tool_market-share_line-chart";

/** Stored procedure name for the market-share bar-chart drill-down datasource. */
export const PERFORMANCE_TOOL_MARKET_SHARE_BAR_CHART_SP_NAME =
  "7_value_creation_performance-tool_market-share_bar-chart";

/** Dataset identifier for the market-share line-chart drill-down datasource. */
export const PERFORMANCE_TOOL_MARKET_SHARE_LINE_CHART_DATASET_ID =
  "performance_tool_market_share_line_chart";

/** Dataset identifier for the market-share bar-chart drill-down datasource. */
export const PERFORMANCE_TOOL_MARKET_SHARE_BAR_CHART_DATASET_ID =
  "performance_tool_market_share_bar_chart";

/** Dataset identifier for the market-share-official (v2) big-numbers drill-down datasource. */
export const PERFORMANCE_TOOL_MARKET_SHARE_OFFICIAL_BIG_NUMBERS_DATASET_ID =
  "performance_tool_market_share_big_numbers";

/** Stored procedure name for the market-share-official (v2) big-numbers drill-down datasource. */
export const PERFORMANCE_TOOL_MARKET_SHARE_OFFICIAL_BIG_NUMBERS_SP_NAME =
  "7_value_creation_performance-tool_market-share_big-numbers";
/** Dataset identifier for the CORES line-chart drill-down datasource. */
export const PERFORMANCE_TOOL_CORES_LINE_CHART_DATASET_ID =
  "performance_tool_finance_line_chart";

/** Dataset identifier for the CORES bar-chart drill-down datasource. */
export const PERFORMANCE_TOOL_CORES_BAR_CHART_DATASET_ID =
  "performance_tool_finance_bar_chart";

/** Stored procedure name for the CORES line-chart drill-down datasource. */
export const PERFORMANCE_TOOL_CORES_LINE_CHART_SP_NAME =
  "7_value_creation_performance-tool_cores_line-chart";

/** Stored procedure name for the CORES bar-chart drill-down datasource. */
export const PERFORMANCE_TOOL_CORES_BAR_CHART_SP_NAME =
  "7_value_creation_performance-tool_cores_bar-chart";

/** Dataset identifier for the CORES contribution-waterfall datasource. */
export const PERFORMANCE_TOOL_CORES_WATERFALL_DATASET_ID =
  "performance_tool_finance_cores_waterfall";

/** Stored procedure registry name for the dedicated CORES waterfall function. */
export const PERFORMANCE_TOOL_CORES_WATERFALL_SP_NAME =
  "7_value_creation_performance-tool_cores_waterfall";

/** Filter names shared by every Performance Tool drill-down KPI. */
export const PERFORMANCE_TOOL_BASE_FILTER_NAMES = [
  "dt_end",
  "country",
  "period_type",
] as const;

/** Filter names added on top of {@link PERFORMANCE_TOOL_BASE_FILTER_NAMES} for finance KPIs. */
export const PERFORMANCE_TOOL_FINANCE_EXTRA_FILTER_NAMES = [
  "growth_lever",
  "brand",
  "sub_brand",
  "zone",
  "page_filter",
  "kpi",
  "waterfall_filter",
] as const;

/** Filter names added on top of {@link PERFORMANCE_TOOL_BASE_FILTER_NAMES} for market-share line/bar chart drill-downs. */
export const PERFORMANCE_TOOL_MARKET_SHARE_EXTRA_FILTER_NAMES = [
  "zone",
  "brand",
  "sub_brand",
  "growth_lever",
  "weight_type",
  "page_filter",
] as const;

/** Filter names added on top of {@link PERFORMANCE_TOOL_BASE_FILTER_NAMES} for market-share waterfall/table drill-down. */
export const PERFORMANCE_TOOL_MARKET_SHARE_WATERFALL_TABLE_EXTRA_FILTER_NAMES =
  [
    "zone",
    "brand",
    "sub_brand",
    "growth_levers",
    "weight_bu",
    "page_filter",
    "kpi",
    "waterfall_filter",
  ] as const;

/** Market-share waterfall/table SP filter contract (`7_value_creation_performance-tool_market-share_waterfall`). */
export const PERFORMANCE_TOOL_MARKET_SHARE_BIG_NUMBERS_FILTER_NAMES = [
  ...PERFORMANCE_TOOL_BASE_FILTER_NAMES,
  ...PERFORMANCE_TOOL_MARKET_SHARE_WATERFALL_TABLE_EXTRA_FILTER_NAMES,
] as const;

/** Finance drill-down filter contract (volume, nr, cores). */
export const PERFORMANCE_TOOL_FINANCE_FILTER_NAMES = [
  ...PERFORMANCE_TOOL_BASE_FILTER_NAMES,
  ...PERFORMANCE_TOOL_FINANCE_EXTRA_FILTER_NAMES,
] as const;

/** Waterfall / contribution component filters — compose when wiring a waterfall datasource. */
export const PERFORMANCE_TOOL_WATERFALL_EXTRA_FILTER_NAMES = [
  "max_ranked",
] as const;

export const PERFORMANCE_TOOL_FILTER_SP_NAME =
  "7_value_creation_performance-tool_filter";
