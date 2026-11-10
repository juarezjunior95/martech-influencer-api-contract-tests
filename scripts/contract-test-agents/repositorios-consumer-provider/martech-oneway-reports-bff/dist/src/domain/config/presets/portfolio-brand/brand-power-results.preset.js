"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zone_country_builder_1 = require("../common/zone-country.builder");
const country_scopes_1 = require("../common/country-scopes");
const brand_power_results_builder_1 = require("../common/brand-power-results.builder");
const { zones, country } = (0, zone_country_builder_1.buildZoneCountryFilters)({
    scope: { countries: country_scopes_1.BRAND_POWER_RESULTS_CODES },
    page: "brand-power-results",
    hideGlobalForKpi: "power",
});
const config = {
    version: "1.0.0",
    cache: {
        enabled: true,
        tags: ["filters"],
    },
    preset: {
        ...(0, brand_power_results_builder_1.buildBrandPowerResultsFilters)(),
        zones,
        country,
        portfolio: {
            filters: [
                { name: "noDefault", value: true },
                { name: "ignoreNab", value: true },
            ],
        },
        segments: {
            filters: [
                { name: "noDefault", value: true },
                { name: "scope", value: "brand_power_book" },
            ],
        },
    },
};
exports.default = config;
//# sourceMappingURL=brand-power-results.preset.js.map