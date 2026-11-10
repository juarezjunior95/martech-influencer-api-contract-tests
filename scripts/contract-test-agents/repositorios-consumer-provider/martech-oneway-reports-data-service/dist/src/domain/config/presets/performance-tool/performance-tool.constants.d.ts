export declare const POWER_KPI = "power";
export declare const VOLUME_KPI = "volume";
export declare const NR_KPI = "nr";
export declare const MARKET_SHARE_KPI = "market_share";
export declare const MARKET_SHARE_OFFICIAL_KPI = "market_share_official";
export declare const CORES_KPI = "cores";
export declare const QUARTERLY = "quarterly";
export declare const MONTHLY = "monthly";
export declare const ALL_BRANDS = "All Brands";
export declare const PORTFOLIO = "Portfolio";
export declare const BEER_PRICE_SEGMENT = "Beer Price Segment";
export declare const GLOBAL_BRANDS = "Global Brands";
export declare const SUPERIOR_CORE = "Superior Core";
export declare const LEAD_PREMIUM = "Lead Premium";
export declare const BALANCED_CHOICES = "Balanced Choices";
export declare const BEYOND_BEER = "Beyond Beer";
export declare const PORTFOLIO_ORDER: readonly ["Megabrands", "Expansion", "Sustain", "Tail"];
export declare const WEIGHT_TYPE_OPTIONS: {
    label: string;
    value: string;
}[];
export declare const KPIS_MAPPING: Record<string, {
    label: string;
    value: string;
    periods: readonly string[];
    group: string;
    brands_classification: string[];
    growth_levers_classification: string[];
    cloneOf?: string;
    weight_type?: {
        label: string;
        value: string;
    }[];
    timePeriod?: boolean;
}>;
export declare const GROWTH_LEVERS_KPIS: readonly ["volume", "market_share_official"];
export declare const ZONE_GLOBAL = "ABI";
export declare const ZONE_EUR = "EUR";
export declare const ZONE_MAPPING: Record<string, {
    label: string;
    value: string;
}>;
export declare const COUNTRY_GLOBAL = "ABI";
export declare const COUNTRY_EUR = "EUR";
export declare const COUNTRY_MAPPING: Record<string, {
    label: string;
    quick_filter_label: string;
    zone: string;
    value: string;
}>;
export declare const COL_KPI_NAME = "KPI_NAME";
export declare const COL_ZONE = "ABI_ZONE";
export declare const COL_COUNTRY_ISO = "COUNTRY_ISO_CODE_3";
export declare const COL_COUNTRY_NAME = "RAW_GEOGRAPHY";
export declare const COL_BRAND = "RAW_BRAND";
export declare const COL_SEGMENT = "SEGMENT";
export declare const COL_PERIOD = "PERIOD";
export declare const COL_SUBBRAND = "SUBBRAND";
export declare const COL_GROWTH_LEVER = "GROWTHLEVER";
export declare const COL_GLOBAL_BRAND = "GLOBALBRAND";
export declare const COL_PRICE_TIER = "PRICE_TIER";
export declare const COL_REGION = "REGION";
export declare const REGION_RESIDUAL = "residual";
export declare const isResidualRegion: (region: string) => boolean;
export declare const REGION_PLACEHOLDER: {
    value: string;
    label: string;
};
export declare const KPIS_ENABLED: readonly ["volume", "power", "nr", "cores", "market_share", "market_share_official"];
