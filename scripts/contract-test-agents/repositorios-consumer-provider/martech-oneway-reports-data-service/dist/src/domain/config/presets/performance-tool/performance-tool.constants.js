"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KPIS_ENABLED = exports.REGION_PLACEHOLDER = exports.isResidualRegion = exports.REGION_RESIDUAL = exports.COL_REGION = exports.COL_PRICE_TIER = exports.COL_GLOBAL_BRAND = exports.COL_GROWTH_LEVER = exports.COL_SUBBRAND = exports.COL_PERIOD = exports.COL_SEGMENT = exports.COL_BRAND = exports.COL_COUNTRY_NAME = exports.COL_COUNTRY_ISO = exports.COL_ZONE = exports.COL_KPI_NAME = exports.COUNTRY_MAPPING = exports.COUNTRY_EUR = exports.COUNTRY_GLOBAL = exports.ZONE_MAPPING = exports.ZONE_EUR = exports.ZONE_GLOBAL = exports.GROWTH_LEVERS_KPIS = exports.KPIS_MAPPING = exports.WEIGHT_TYPE_OPTIONS = exports.PORTFOLIO_ORDER = exports.BEYOND_BEER = exports.BALANCED_CHOICES = exports.LEAD_PREMIUM = exports.SUPERIOR_CORE = exports.GLOBAL_BRANDS = exports.BEER_PRICE_SEGMENT = exports.PORTFOLIO = exports.ALL_BRANDS = exports.MONTHLY = exports.QUARTERLY = exports.CORES_KPI = exports.MARKET_SHARE_OFFICIAL_KPI = exports.MARKET_SHARE_KPI = exports.NR_KPI = exports.VOLUME_KPI = exports.POWER_KPI = void 0;
exports.POWER_KPI = "power";
exports.VOLUME_KPI = "volume";
exports.NR_KPI = "nr";
exports.MARKET_SHARE_KPI = "market_share";
exports.MARKET_SHARE_OFFICIAL_KPI = "market_share_official";
exports.CORES_KPI = "cores";
exports.QUARTERLY = "quarterly";
exports.MONTHLY = "monthly";
exports.ALL_BRANDS = "All Brands";
exports.PORTFOLIO = "Portfolio";
exports.BEER_PRICE_SEGMENT = "Beer Price Segment";
exports.GLOBAL_BRANDS = "Global Brands";
exports.SUPERIOR_CORE = "Superior Core";
exports.LEAD_PREMIUM = "Lead Premium";
exports.BALANCED_CHOICES = "Balanced Choices";
exports.BEYOND_BEER = "Beyond Beer";
exports.PORTFOLIO_ORDER = [
    "Megabrands",
    "Expansion",
    "Sustain",
    "Tail",
];
exports.WEIGHT_TYPE_OPTIONS = [
    { label: "Budget", value: "bu" },
    { label: "Industry", value: "ind" },
];
exports.KPIS_MAPPING = {
    [exports.VOLUME_KPI]: {
        label: "Volume",
        value: "VOLUME",
        periods: [exports.MONTHLY],
        group: "volume",
        brands_classification: [
            exports.ALL_BRANDS,
            exports.PORTFOLIO,
            exports.BEER_PRICE_SEGMENT,
            exports.GLOBAL_BRANDS,
        ],
        growth_levers_classification: [
            exports.SUPERIOR_CORE,
            exports.LEAD_PREMIUM,
            exports.BALANCED_CHOICES,
            exports.BEYOND_BEER,
        ],
        timePeriod: true,
    },
    [exports.NR_KPI]: {
        label: "Net Revenue",
        value: "NR",
        periods: [exports.MONTHLY],
        group: "finance",
        brands_classification: [],
        growth_levers_classification: [],
        cloneOf: exports.VOLUME_KPI,
        timePeriod: true,
    },
    [exports.CORES_KPI]: {
        label: "CORES",
        value: "CORES",
        periods: [exports.MONTHLY],
        group: "finance",
        brands_classification: [],
        growth_levers_classification: [],
        cloneOf: exports.VOLUME_KPI,
        timePeriod: true,
    },
    [exports.MARKET_SHARE_KPI]: {
        label: "Market Share",
        value: "MARKET_SHARE",
        periods: [exports.MONTHLY],
        group: "market_share",
        brands_classification: [exports.ALL_BRANDS],
        growth_levers_classification: [],
    },
    [exports.MARKET_SHARE_OFFICIAL_KPI]: {
        label: "Market Share Official",
        value: "MARKET_SHARE_OFFICIAL",
        periods: [exports.MONTHLY],
        group: "market_share_official_total",
        brands_classification: [
            exports.ALL_BRANDS,
            exports.PORTFOLIO,
            exports.BEER_PRICE_SEGMENT,
            exports.GLOBAL_BRANDS,
        ],
        weight_type: exports.WEIGHT_TYPE_OPTIONS,
        growth_levers_classification: [exports.SUPERIOR_CORE, exports.LEAD_PREMIUM],
        timePeriod: true,
    },
    [exports.POWER_KPI]: {
        label: "Brand Power",
        value: "POWER",
        periods: [exports.QUARTERLY],
        group: "power",
        brands_classification: [exports.ALL_BRANDS, exports.PORTFOLIO],
        growth_levers_classification: [],
    },
};
exports.GROWTH_LEVERS_KPIS = [
    exports.VOLUME_KPI,
    exports.MARKET_SHARE_OFFICIAL_KPI,
];
exports.ZONE_GLOBAL = "ABI";
exports.ZONE_EUR = "EUR";
exports.ZONE_MAPPING = {
    [exports.ZONE_GLOBAL]: { label: "Global", value: exports.ZONE_GLOBAL },
};
exports.COUNTRY_GLOBAL = "ABI";
exports.COUNTRY_EUR = "EUR";
exports.COUNTRY_MAPPING = {
    [exports.COUNTRY_GLOBAL]: {
        label: "All",
        quick_filter_label: "Global",
        zone: exports.ZONE_GLOBAL,
        value: exports.COUNTRY_GLOBAL,
    },
    [exports.COUNTRY_EUR]: {
        label: "All",
        quick_filter_label: "Europe",
        zone: exports.ZONE_EUR,
        value: exports.COUNTRY_GLOBAL,
    },
};
exports.COL_KPI_NAME = "KPI_NAME";
exports.COL_ZONE = "ABI_ZONE";
exports.COL_COUNTRY_ISO = "COUNTRY_ISO_CODE_3";
exports.COL_COUNTRY_NAME = "RAW_GEOGRAPHY";
exports.COL_BRAND = "RAW_BRAND";
exports.COL_SEGMENT = "SEGMENT";
exports.COL_PERIOD = "PERIOD";
exports.COL_SUBBRAND = "SUBBRAND";
exports.COL_GROWTH_LEVER = "GROWTHLEVER";
exports.COL_GLOBAL_BRAND = "GLOBALBRAND";
exports.COL_PRICE_TIER = "PRICE_TIER";
exports.COL_REGION = "REGION";
exports.REGION_RESIDUAL = "residual";
const isResidualRegion = (region) => region.trim().toLowerCase() === exports.REGION_RESIDUAL;
exports.isResidualRegion = isResidualRegion;
exports.REGION_PLACEHOLDER = { value: "All", label: "Select a Region" };
exports.KPIS_ENABLED = [
    exports.VOLUME_KPI,
    exports.POWER_KPI,
    exports.NR_KPI,
    exports.CORES_KPI,
    exports.MARKET_SHARE_KPI,
    exports.MARKET_SHARE_OFFICIAL_KPI,
];
//# sourceMappingURL=performance-tool.constants.js.map