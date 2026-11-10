"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BRAND_POWER_RESULTS_PRESET_REF = exports.BRAND_POWER_BOOK_SCOPES_PRESET_REF = exports.GLOBAL_BRANDS_PRESET_REF = void 0;
exports.buildBrandPowerResultsFilters = buildBrandPowerResultsFilters;
exports.GLOBAL_BRANDS_PRESET_REF = "global-brands";
exports.BRAND_POWER_BOOK_SCOPES_PRESET_REF = "brand-power-book-scopes";
exports.BRAND_POWER_RESULTS_PRESET_REF = "brand-power-results";
function buildBrandPowerResultsFilters() {
    return {
        [exports.GLOBAL_BRANDS_PRESET_REF]: brandsScopeRefConfig(),
        [exports.BRAND_POWER_BOOK_SCOPES_PRESET_REF]: brandPowerScopeRefConfig(),
        [exports.BRAND_POWER_RESULTS_PRESET_REF]: brandPowerScopeRefConfig(),
    };
}
function brandsScopeRefConfig() {
    return {
        filters: [{ name: "noDefault", value: "true" }],
        formatter: "presets/filter-name-normalization",
    };
}
function brandPowerScopeRefConfig() {
    return {
        filters: [],
        formatter: "presets/filter-name-normalization",
    };
}
//# sourceMappingURL=brand-power-results.builder.js.map