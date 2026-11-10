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
export interface PerformanceToolDimensionConfig<T extends PerformanceToolOption = PerformanceToolOption> {
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
export type PerformanceToolTimePeriodType = "YTD" | "HALF" | "QTR" | "R3M" | "MTH" | "FY";
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
export type PerformanceToolPresetValue = Record<string, unknown>;
export declare const PERFORMANCE_TOOL_DATASET_ID = "performance-tool-kpis";
export declare const PERFORMANCE_TOOL_FILTER_QUERY = "presets/performance-tool-kpis";
export declare const PERFORMANCE_TOOL_VOLUME_LINE_CHART_DATASET_ID = "performance_tool_finance_line_chart";
export declare const PERFORMANCE_TOOL_VOLUME_BAR_CHART_DATASET_ID = "performance_tool_finance_bar_chart";
export declare const PERFORMANCE_TOOL_VOLUME_WATERFALL_DATASET_ID = "performance_tool_finance_waterfall";
export declare const PERFORMANCE_TOOL_VOLUME_LINE_CHART_SP_NAME = "7_value_creation_performance-tool_volume_line-chart";
export declare const PERFORMANCE_TOOL_VOLUME_BAR_CHART_SP_NAME = "7_value_creation_performance-tool_volume_bar-chart";
export declare const PERFORMANCE_TOOL_VOLUME_WATERFALL_SP_NAME = "7_value_creation_performance-tool_volume_waterfall";
export declare const PERFORMANCE_TOOL_FINANCE_BIG_NUMBERS_DATASET_ID = "performance_tool_finance_big_numbers";
export declare const PERFORMANCE_TOOL_VOLUME_BIG_NUMBERS_DATASET_ID = "performance_tool_finance_big_numbers";
export declare const PERFORMANCE_TOOL_VOLUME_BIG_NUMBERS_SP_NAME = "7_value_creation_performance-tool_volume_big-numbers";
export declare const PERFORMANCE_TOOL_MARKET_SHARE_UPDATE_STATUS_DATASET_ID = "performance_tool_market_share_update_status";
export declare const PERFORMANCE_TOOL_MARKET_SHARE_UPDATE_STATUS_SP_NAME = "7_value_creation_performance-tool_market-share_update-status";
export declare const PERFORMANCE_TOOL_CORES_BIG_NUMBERS_SP_NAME = "7_value_creation_performance-tool_cores_big-numbers";
export declare const PERFORMANCE_TOOL_MARKET_SHARE_WATERFALL_DATASET_ID = "performance_tool_market_share_waterfall";
export declare const PERFORMANCE_TOOL_MARKET_SHARE_WATERFALL_SP_NAME = "7_value_creation_performance-tool_market-share_waterfall";
export declare const PERFORMANCE_TOOL_NET_REVENUE_BIG_NUMBERS_DATASET_ID = "performance_tool_finance_big_numbers";
export declare const PERFORMANCE_TOOL_NET_REVENUE_BIG_NUMBERS_SP_NAME = "7_value_creation_performance-tool_net-revenue_big-numbers";
export declare const PERFORMANCE_TOOL_NET_REVENUE_WATERFALL_DATASET_ID = "performance_tool_finance_nr_waterfall";
export declare const PERFORMANCE_TOOL_NET_REVENUE_WATERFALL_SP_NAME = "7_value_creation_performance-tool_net-revenue_waterfall";
export declare const PERFORMANCE_TOOL_NET_REVENUE_LINE_CHART_DATASET_ID = "performance_tool_finance_line_chart";
export declare const PERFORMANCE_TOOL_NET_REVENUE_BAR_CHART_DATASET_ID = "performance_tool_finance_bar_chart";
export declare const PERFORMANCE_TOOL_NET_REVENUE_LINE_CHART_SP_NAME = "7_value_creation_performance-tool_net-revenue_line-chart";
export declare const PERFORMANCE_TOOL_NET_REVENUE_BAR_CHART_SP_NAME = "7_value_creation_performance-tool_net-revenue_bar-chart";
export declare const PERFORMANCE_TOOL_MARKET_SHARE_LINE_CHART_SP_NAME = "7_value_creation_performance-tool_market-share_line-chart";
export declare const PERFORMANCE_TOOL_MARKET_SHARE_BAR_CHART_SP_NAME = "7_value_creation_performance-tool_market-share_bar-chart";
export declare const PERFORMANCE_TOOL_MARKET_SHARE_LINE_CHART_DATASET_ID = "performance_tool_market_share_line_chart";
export declare const PERFORMANCE_TOOL_MARKET_SHARE_BAR_CHART_DATASET_ID = "performance_tool_market_share_bar_chart";
export declare const PERFORMANCE_TOOL_MARKET_SHARE_OFFICIAL_BIG_NUMBERS_DATASET_ID = "performance_tool_market_share_big_numbers";
export declare const PERFORMANCE_TOOL_MARKET_SHARE_OFFICIAL_BIG_NUMBERS_SP_NAME = "7_value_creation_performance-tool_market-share_big-numbers";
export declare const PERFORMANCE_TOOL_CORES_LINE_CHART_DATASET_ID = "performance_tool_finance_line_chart";
export declare const PERFORMANCE_TOOL_CORES_BAR_CHART_DATASET_ID = "performance_tool_finance_bar_chart";
export declare const PERFORMANCE_TOOL_CORES_LINE_CHART_SP_NAME = "7_value_creation_performance-tool_cores_line-chart";
export declare const PERFORMANCE_TOOL_CORES_BAR_CHART_SP_NAME = "7_value_creation_performance-tool_cores_bar-chart";
export declare const PERFORMANCE_TOOL_CORES_WATERFALL_DATASET_ID = "performance_tool_finance_cores_waterfall";
export declare const PERFORMANCE_TOOL_CORES_WATERFALL_SP_NAME = "7_value_creation_performance-tool_cores_waterfall";
export declare const PERFORMANCE_TOOL_BASE_FILTER_NAMES: readonly ["dt_end", "country", "period_type"];
export declare const PERFORMANCE_TOOL_FINANCE_EXTRA_FILTER_NAMES: readonly ["growth_lever", "brand", "sub_brand", "zone", "page_filter", "kpi", "waterfall_filter"];
export declare const PERFORMANCE_TOOL_MARKET_SHARE_EXTRA_FILTER_NAMES: readonly ["zone", "brand", "sub_brand", "growth_lever", "weight_type", "page_filter"];
export declare const PERFORMANCE_TOOL_MARKET_SHARE_WATERFALL_TABLE_EXTRA_FILTER_NAMES: readonly ["zone", "brand", "sub_brand", "growth_levers", "weight_bu", "page_filter", "kpi", "waterfall_filter"];
export declare const PERFORMANCE_TOOL_MARKET_SHARE_BIG_NUMBERS_FILTER_NAMES: readonly ["dt_end", "country", "period_type", "zone", "brand", "sub_brand", "growth_levers", "weight_bu", "page_filter", "kpi", "waterfall_filter"];
export declare const PERFORMANCE_TOOL_FINANCE_FILTER_NAMES: readonly ["dt_end", "country", "period_type", "growth_lever", "brand", "sub_brand", "zone", "page_filter", "kpi", "waterfall_filter"];
export declare const PERFORMANCE_TOOL_WATERFALL_EXTRA_FILTER_NAMES: readonly ["max_ranked"];
export declare const PERFORMANCE_TOOL_FILTER_SP_NAME = "7_value_creation_performance-tool_filter";
