export interface CommercialResultsFilterRawRow {
    country_iso_code_3: string;
    zone: string;
    region: string;
    period: string;
    brand: string;
    sub_brand: string;
    sku: string;
    channel: string;
    pack_type: string;
    category: string;
    non_alc_beer: string;
    growth_levers: string;
    beer_price_segment: string;
    portfolio: string;
}
export interface CommercialResultsOption {
    value: string;
    label: string;
    image_url?: string;
    image_variants?: Record<string, string>;
}
export interface CommercialResultsSkuOption extends CommercialResultsOption {
    sub_brand?: string;
}
export interface CommercialResultsCountryEntry {
    value: string;
    label: string;
    zone: string;
    quick_filter_label: string;
}
export interface CommercialResultsZoneOption {
    value: string;
    label: string;
}
export interface CommercialResultsPeriodOption {
    value: string;
    label: string;
    full: string;
}
export interface CommercialResultsDimension<TDefault, TValues = TDefault[]> {
    enabled: boolean;
    default: TDefault | null;
    values: TValues;
}
export type CommercialResultsZonesDimension = CommercialResultsDimension<CommercialResultsZoneOption>;
export type CommercialResultsCountryDimension = CommercialResultsDimension<CommercialResultsCountryEntry, Record<string, CommercialResultsCountryEntry[]>>;
export type CommercialResultsRegionDimension = CommercialResultsDimension<CommercialResultsOption, Record<string, CommercialResultsOption[]>>;
export type CommercialResultsPeriodsDimension = CommercialResultsDimension<CommercialResultsPeriodOption>;
export type CommercialResultsListDimension = CommercialResultsDimension<CommercialResultsOption>;
export type CommercialResultsSkuDimension = CommercialResultsDimension<CommercialResultsOption, Record<string, CommercialResultsSkuOption[]>>;
export interface CommercialResultsFilterResponse {
    kpis: CommercialResultsListDimension;
    zones: CommercialResultsZonesDimension;
    country: CommercialResultsCountryDimension;
    region: CommercialResultsRegionDimension;
    periods: CommercialResultsPeriodsDimension;
    brands: CommercialResultsListDimension;
    sub_brands: CommercialResultsListDimension;
    channel: CommercialResultsListDimension;
    pack_type: CommercialResultsListDimension;
    sku: CommercialResultsSkuDimension;
    category: CommercialResultsListDimension;
    non_alcoholic: CommercialResultsListDimension;
    growth_levers: CommercialResultsListDimension;
    beer_price_segment: CommercialResultsListDimension;
    portfolios: CommercialResultsListDimension;
}
export declare const COMMERCIAL_RESULTS_DATASET_ID = "commercial-results";
export declare const COMMERCIAL_RESULTS_BRANDS_DATASET_ID = "commercial-results-brands";
export declare const COMMERCIAL_RESULTS_GEO_DATASET_ID = "commercial-results-geo";
export declare const COMMERCIAL_RESULTS_SP_NAME = "7_value_creation_commercial-results_filter";
export declare const COMMERCIAL_RESULTS_VOLUME_LINE_CHART_DATASET_ID = "commercial-results-line-chart";
export declare const COMMERCIAL_RESULTS_VOLUME_BAR_CHART_DATASET_ID = "commercial-results-bar-chart";
export declare const COMMERCIAL_RESULTS_VOLUME_WATERFALL_DATASET_ID = "commercial-results-waterfall";
export declare const COMMERCIAL_RESULTS_VOLUME_LINE_CHART_SP_NAME = "7_value_creation_commercial-results_volume_line-chart";
export declare const COMMERCIAL_RESULTS_VOLUME_BAR_CHART_SP_NAME = "7_value_creation_commercial-results_volume_bar-chart";
export declare const COMMERCIAL_RESULTS_VOLUME_WATERFALL_SP_NAME = "7_value_creation_commercial-results_volume_waterfall";
export declare const COMMERCIAL_RESULTS_VOLUME_BIG_NUMBERS_DATASET_ID = "commercial-results-big-numbers";
export declare const COMMERCIAL_RESULTS_VOLUME_BIG_NUMBERS_SP_NAME = "7_value_creation_commercial-results_volume_big-numbers";
export declare const COMMERCIAL_RESULTS_NET_REVENUE_LINE_CHART_DATASET_ID = "commercial-results-net-revenue-line-chart";
export declare const COMMERCIAL_RESULTS_NET_REVENUE_BAR_CHART_DATASET_ID = "commercial-results-net-revenue-bar-chart";
export declare const COMMERCIAL_RESULTS_NET_REVENUE_WATERFALL_DATASET_ID = "commercial-results-net-revenue-waterfall";
export declare const COMMERCIAL_RESULTS_NET_REVENUE_BIG_NUMBERS_DATASET_ID = "commercial-results-net-revenue-big-numbers";
export declare const COMMERCIAL_RESULTS_NET_REVENUE_LINE_CHART_SP_NAME = "7_value_creation_commercial-results_net-revenue_line-chart";
export declare const COMMERCIAL_RESULTS_NET_REVENUE_BAR_CHART_SP_NAME = "7_value_creation_commercial-results_net-revenue_bar-chart";
export declare const COMMERCIAL_RESULTS_NET_REVENUE_WATERFALL_SP_NAME = "7_value_creation_commercial-results_net-revenue_waterfall";
export declare const COMMERCIAL_RESULTS_NET_REVENUE_BIG_NUMBERS_SP_NAME = "7_value_creation_commercial-results_net-revenue_big-numbers";
export declare const COMMERCIAL_RESULTS_COMMON_FILTER_NAMES: readonly ["dt_end", "zone", "country", "region", "period_type", "brand", "sub_brand", "sku", "pack_type", "channel", "category", "non_alcoholic", "growth_levers", "beer_price_segment", "portfolios"];
export declare const COMMERCIAL_RESULTS_NET_REVENUE_COMMON_FILTER_NAMES: readonly ["dt_end", "zone", "country", "region", "period_type", "brand", "sub_brand", "sku", "pack_type", "channel", "category", "non_alcoholic", "growth_levers", "beer_price_segment", "portfolios", "kpi"];
export declare const COMMERCIAL_RESULTS_WATERFALL_FILTER_NAMES: readonly ["waterfall_filter", "max_ranked"];
export interface CommercialResultsPresetConfig {
    kpi?: string;
    brand?: string;
    country?: string;
    channel?: string;
    region?: string;
    pack_type?: string;
    category?: string;
    non_alcoholic?: string;
    growth_levers?: string;
    beer_price_segment?: string;
    portfolios?: string;
}
export declare function isCommercialResultsPresetConfig(val: unknown): val is CommercialResultsPresetConfig;
export declare function isCommercialResultsDimensionAll(value: string | undefined | null): boolean;
export declare function isCommercialResultsBrandAll(filters?: CommercialResultsPresetConfig): boolean;
export declare function normalizeCommercialResultsPresetConfig(raw: CommercialResultsPresetConfig | undefined): CommercialResultsPresetConfig | undefined;
declare const COMMERCIAL_ROW_DRIVER_TO_RAW_ROW_KEY: {
    readonly brand: "brand";
    readonly channel: "channel";
    readonly region: "region";
    readonly pack_type: "pack_type";
    readonly category: "category";
    readonly non_alcoholic: "non_alc_beer";
    readonly growth_levers: "growth_levers";
    readonly beer_price_segment: "beer_price_segment";
    readonly portfolios: "portfolio";
};
declare const COMMERCIAL_ROW_DRIVER_KEYS: Array<keyof typeof COMMERCIAL_ROW_DRIVER_TO_RAW_ROW_KEY>;
type CommercialRowDriverKey = (typeof COMMERCIAL_ROW_DRIVER_KEYS)[number];
export type FilterRowsByActiveDriversOptions = {
    skipKeys?: CommercialRowDriverKey[];
};
export declare function filterRowsByActiveDrivers(rows: CommercialResultsFilterRawRow[], cfg: CommercialResultsPresetConfig | undefined, options?: FilterRowsByActiveDriversOptions): CommercialResultsFilterRawRow[];
export {};
