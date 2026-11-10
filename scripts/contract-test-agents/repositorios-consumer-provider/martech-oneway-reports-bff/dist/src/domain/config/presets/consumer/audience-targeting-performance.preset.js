"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zone_country_builder_1 = require("../common/zone-country.builder");
const country_scopes_1 = require("../common/country-scopes");
const { zones, country } = (0, zone_country_builder_1.buildZoneCountryFilters)({
    scope: { countries: country_scopes_1.AUDIENCE_TARGETING_CODES },
});
const config = {
    version: "1.0.0",
    cache: {
        enabled: true,
        tags: ["filters"],
    },
    preset: {
        zones,
        country,
        "audience-targeting-brands": {
            filters: [],
            formatter: "presets/filter-name-normalization",
        },
        periods: {
            filters: [{ name: "scope", value: "R12M" }],
        },
        kpis: {
            filters: [{ name: "kpi_groups", value: "audience_targeting" }],
        },
        segments: {
            filters: [{ name: "scope", value: "audience_targeting" }],
        },
    },
};
exports.default = config;
//# sourceMappingURL=audience-targeting-performance.preset.js.map