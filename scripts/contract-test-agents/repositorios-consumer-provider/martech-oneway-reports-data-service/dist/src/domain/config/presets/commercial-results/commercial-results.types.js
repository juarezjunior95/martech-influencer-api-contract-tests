"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMERCIAL_RESULTS_WATERFALL_FILTER_NAMES = exports.COMMERCIAL_RESULTS_NET_REVENUE_COMMON_FILTER_NAMES = exports.COMMERCIAL_RESULTS_COMMON_FILTER_NAMES = exports.COMMERCIAL_RESULTS_NET_REVENUE_BIG_NUMBERS_SP_NAME = exports.COMMERCIAL_RESULTS_NET_REVENUE_WATERFALL_SP_NAME = exports.COMMERCIAL_RESULTS_NET_REVENUE_BAR_CHART_SP_NAME = exports.COMMERCIAL_RESULTS_NET_REVENUE_LINE_CHART_SP_NAME = exports.COMMERCIAL_RESULTS_NET_REVENUE_BIG_NUMBERS_DATASET_ID = exports.COMMERCIAL_RESULTS_NET_REVENUE_WATERFALL_DATASET_ID = exports.COMMERCIAL_RESULTS_NET_REVENUE_BAR_CHART_DATASET_ID = exports.COMMERCIAL_RESULTS_NET_REVENUE_LINE_CHART_DATASET_ID = exports.COMMERCIAL_RESULTS_VOLUME_BIG_NUMBERS_SP_NAME = exports.COMMERCIAL_RESULTS_VOLUME_BIG_NUMBERS_DATASET_ID = exports.COMMERCIAL_RESULTS_VOLUME_WATERFALL_SP_NAME = exports.COMMERCIAL_RESULTS_VOLUME_BAR_CHART_SP_NAME = exports.COMMERCIAL_RESULTS_VOLUME_LINE_CHART_SP_NAME = exports.COMMERCIAL_RESULTS_VOLUME_WATERFALL_DATASET_ID = exports.COMMERCIAL_RESULTS_VOLUME_BAR_CHART_DATASET_ID = exports.COMMERCIAL_RESULTS_VOLUME_LINE_CHART_DATASET_ID = exports.COMMERCIAL_RESULTS_SP_NAME = exports.COMMERCIAL_RESULTS_GEO_DATASET_ID = exports.COMMERCIAL_RESULTS_BRANDS_DATASET_ID = exports.COMMERCIAL_RESULTS_DATASET_ID = void 0;
exports.isCommercialResultsPresetConfig = isCommercialResultsPresetConfig;
exports.isCommercialResultsDimensionAll = isCommercialResultsDimensionAll;
exports.isCommercialResultsBrandAll = isCommercialResultsBrandAll;
exports.normalizeCommercialResultsPresetConfig = normalizeCommercialResultsPresetConfig;
exports.filterRowsByActiveDrivers = filterRowsByActiveDrivers;
exports.COMMERCIAL_RESULTS_DATASET_ID = "commercial-results";
exports.COMMERCIAL_RESULTS_BRANDS_DATASET_ID = "commercial-results-brands";
exports.COMMERCIAL_RESULTS_GEO_DATASET_ID = "commercial-results-geo";
exports.COMMERCIAL_RESULTS_SP_NAME = "7_value_creation_commercial-results_filter";
exports.COMMERCIAL_RESULTS_VOLUME_LINE_CHART_DATASET_ID = "commercial-results-line-chart";
exports.COMMERCIAL_RESULTS_VOLUME_BAR_CHART_DATASET_ID = "commercial-results-bar-chart";
exports.COMMERCIAL_RESULTS_VOLUME_WATERFALL_DATASET_ID = "commercial-results-waterfall";
exports.COMMERCIAL_RESULTS_VOLUME_LINE_CHART_SP_NAME = "7_value_creation_commercial-results_volume_line-chart";
exports.COMMERCIAL_RESULTS_VOLUME_BAR_CHART_SP_NAME = "7_value_creation_commercial-results_volume_bar-chart";
exports.COMMERCIAL_RESULTS_VOLUME_WATERFALL_SP_NAME = "7_value_creation_commercial-results_volume_waterfall";
exports.COMMERCIAL_RESULTS_VOLUME_BIG_NUMBERS_DATASET_ID = "commercial-results-big-numbers";
exports.COMMERCIAL_RESULTS_VOLUME_BIG_NUMBERS_SP_NAME = "7_value_creation_commercial-results_volume_big-numbers";
exports.COMMERCIAL_RESULTS_NET_REVENUE_LINE_CHART_DATASET_ID = "commercial-results-net-revenue-line-chart";
exports.COMMERCIAL_RESULTS_NET_REVENUE_BAR_CHART_DATASET_ID = "commercial-results-net-revenue-bar-chart";
exports.COMMERCIAL_RESULTS_NET_REVENUE_WATERFALL_DATASET_ID = "commercial-results-net-revenue-waterfall";
exports.COMMERCIAL_RESULTS_NET_REVENUE_BIG_NUMBERS_DATASET_ID = "commercial-results-net-revenue-big-numbers";
exports.COMMERCIAL_RESULTS_NET_REVENUE_LINE_CHART_SP_NAME = "7_value_creation_commercial-results_net-revenue_line-chart";
exports.COMMERCIAL_RESULTS_NET_REVENUE_BAR_CHART_SP_NAME = "7_value_creation_commercial-results_net-revenue_bar-chart";
exports.COMMERCIAL_RESULTS_NET_REVENUE_WATERFALL_SP_NAME = "7_value_creation_commercial-results_net-revenue_waterfall";
exports.COMMERCIAL_RESULTS_NET_REVENUE_BIG_NUMBERS_SP_NAME = "7_value_creation_commercial-results_net-revenue_big-numbers";
exports.COMMERCIAL_RESULTS_COMMON_FILTER_NAMES = [
    "dt_end",
    "zone",
    "country",
    "region",
    "period_type",
    "brand",
    "sub_brand",
    "sku",
    "pack_type",
    "channel",
    "category",
    "non_alcoholic",
    "growth_levers",
    "beer_price_segment",
    "portfolios",
];
exports.COMMERCIAL_RESULTS_NET_REVENUE_COMMON_FILTER_NAMES = [
    ...exports.COMMERCIAL_RESULTS_COMMON_FILTER_NAMES,
    "kpi",
];
exports.COMMERCIAL_RESULTS_WATERFALL_FILTER_NAMES = [
    "waterfall_filter",
    "max_ranked",
];
function isCommercialResultsPresetConfig(val) {
    return typeof val === "object" && val !== null && !Array.isArray(val);
}
function isCommercialResultsDimensionAll(value) {
    return String(value ?? "ALL").toLowerCase() === "all";
}
function isCommercialResultsBrandAll(filters) {
    return isCommercialResultsDimensionAll(filters?.brand);
}
const COMMERCIAL_RESULTS_SCALAR_FILTER_KEYS = [
    "brand",
    "country",
    "channel",
    "region",
    "pack_type",
    "category",
    "non_alcoholic",
    "growth_levers",
    "beer_price_segment",
    "portfolios",
];
function restoreCommercialResultsScalar(value) {
    return Array.isArray(value) ? value.map(String).join(", ") : value;
}
function normalizeCommercialResultsPresetConfig(raw) {
    if (!raw)
        return undefined;
    const legacy = raw;
    const normalized = {
        ...raw,
    };
    for (const key of COMMERCIAL_RESULTS_SCALAR_FILTER_KEYS) {
        if (key in raw) {
            normalized[key] = restoreCommercialResultsScalar(raw[key]);
        }
    }
    return {
        ...normalized,
        pack_type: restoreCommercialResultsScalar(raw.pack_type ?? legacy.packType),
        non_alcoholic: restoreCommercialResultsScalar(raw.non_alcoholic ?? legacy.nonAlcoholic),
        growth_levers: restoreCommercialResultsScalar(raw.growth_levers ?? legacy.growthLevers),
        beer_price_segment: restoreCommercialResultsScalar(raw.beer_price_segment ?? legacy.beerPriceSegment),
    };
}
function normalizeCommercialResultsComparisonValue(value) {
    return String(value ?? "")
        .split(",")
        .map((part) => part.trim())
        .join(",");
}
const COMMERCIAL_ROW_DRIVER_TO_RAW_ROW_KEY = {
    brand: "brand",
    channel: "channel",
    region: "region",
    pack_type: "pack_type",
    category: "category",
    non_alcoholic: "non_alc_beer",
    growth_levers: "growth_levers",
    beer_price_segment: "beer_price_segment",
    portfolios: "portfolio",
};
const COMMERCIAL_ROW_DRIVER_KEYS = Object.keys(COMMERCIAL_ROW_DRIVER_TO_RAW_ROW_KEY);
function filterRowsByActiveDrivers(rows, cfg, options) {
    if (!cfg)
        return rows;
    const skip = new Set(options?.skipKeys ?? []);
    return rows.filter((row) => {
        for (const key of COMMERCIAL_ROW_DRIVER_KEYS) {
            if (skip.has(key))
                continue;
            const driverValue = cfg[key];
            if (isCommercialResultsDimensionAll(driverValue))
                continue;
            const rowKey = COMMERCIAL_ROW_DRIVER_TO_RAW_ROW_KEY[key];
            if (normalizeCommercialResultsComparisonValue(row[rowKey]) !==
                normalizeCommercialResultsComparisonValue(driverValue)) {
                return false;
            }
        }
        return true;
    });
}
//# sourceMappingURL=commercial-results.types.js.map