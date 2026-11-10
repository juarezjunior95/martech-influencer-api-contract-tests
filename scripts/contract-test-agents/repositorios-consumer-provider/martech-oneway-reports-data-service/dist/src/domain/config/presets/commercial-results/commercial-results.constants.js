"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZONE_AFFINITY_GROUPS = exports.FILTER_PLACEHOLDERS = exports.PORTFOLIOS_ALLOWED_SET = exports.BEER_PRICE_SEGMENT_ALLOWED_SET = exports.GROWTH_LEVERS_ALLOWED_SET = exports.PORTFOLIOS_ALLOWED = exports.BEER_PRICE_SEGMENT_ALLOWED = exports.GROWTH_LEVERS_ALLOWED = exports.FILTER_PLACEHOLDER_VALUE = exports.STATIC_PERIOD_OPTIONS = exports.PERIOD_NORMALIZATION = exports.PERIOD_ORDER = exports.COMMERCIAL_RESULTS_PERIOD_KPI_GROUPS = exports.COMMERCIAL_RESULTS_DEFAULT_KPI = exports.COMMERCIAL_RESULTS_KPI_OPTIONS = void 0;
const performance_tool_constants_1 = require("../performance-tool/performance-tool.constants");
exports.COMMERCIAL_RESULTS_KPI_OPTIONS = [
    { value: "volume", label: "Volume" },
    { value: "nr", label: "Net Revenue" },
];
exports.COMMERCIAL_RESULTS_DEFAULT_KPI = exports.COMMERCIAL_RESULTS_KPI_OPTIONS[0];
exports.COMMERCIAL_RESULTS_PERIOD_KPI_GROUPS = {
    volume: "sku_pnl",
    nr: "sku_pnl_nr",
};
exports.PERIOD_ORDER = ["YTD", "L3M", "MTD"];
exports.PERIOD_NORMALIZATION = {
    MTH: "MTD",
};
exports.STATIC_PERIOD_OPTIONS = [
    { value: "YTD", label: "YTD", full: "Year To Date (YTD)" },
    { value: "L3M", label: "L3M", full: "Last 3 Months (L3M)" },
    { value: "MTD", label: "MTD", full: "Month To Date (MTD)" },
];
exports.FILTER_PLACEHOLDER_VALUE = "All";
exports.GROWTH_LEVERS_ALLOWED = [
    performance_tool_constants_1.BALANCED_CHOICES,
    performance_tool_constants_1.BEYOND_BEER,
    performance_tool_constants_1.LEAD_PREMIUM,
    performance_tool_constants_1.SUPERIOR_CORE,
];
exports.BEER_PRICE_SEGMENT_ALLOWED = [
    "Super Premium",
    "Premium",
    "Core+",
    "Core",
    "Value",
];
exports.PORTFOLIOS_ALLOWED = performance_tool_constants_1.PORTFOLIO_ORDER;
exports.GROWTH_LEVERS_ALLOWED_SET = new Set(exports.GROWTH_LEVERS_ALLOWED);
exports.BEER_PRICE_SEGMENT_ALLOWED_SET = new Set(exports.BEER_PRICE_SEGMENT_ALLOWED);
exports.PORTFOLIOS_ALLOWED_SET = new Set(exports.PORTFOLIOS_ALLOWED);
function placeholderOption(label) {
    return { value: exports.FILTER_PLACEHOLDER_VALUE, label };
}
exports.FILTER_PLACEHOLDERS = {
    region: placeholderOption("Select a Region"),
    brand: placeholderOption("Select a Brand"),
    subBrand: placeholderOption("Select a Sub Brand"),
    subBrandNoBrand: placeholderOption("Select a Brand first"),
    sku: placeholderOption("Select a SKU"),
    skuNoBrand: placeholderOption("Select a Brand first"),
    channel: placeholderOption("Select a Channel"),
    packType: placeholderOption("Select a Pack type"),
    category: placeholderOption("Select a Category"),
    nonAlcoholic: placeholderOption("Select a Type"),
    growthLevers: placeholderOption("Select a Growth Levers"),
    beerPriceSegment: placeholderOption("Select a Segment"),
    portfolios: placeholderOption("Select a Portfolio"),
};
exports.ZONE_AFFINITY_GROUPS = [
    ["MAZ", "NAZ", "SAZ"],
    ["EUR", "AFR"],
    ["APAC"],
];
//# sourceMappingURL=commercial-results.constants.js.map