"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zone_country_builder_1 = require("../common/zone-country.builder");
const country_scopes_1 = require("../common/country-scopes");
const { zones, country } = (0, zone_country_builder_1.buildZoneCountryFilters)({
    scope: { countries: country_scopes_1.CATEGORY_HEALTH_CODES },
    page: "category_category-health",
});
const config = {
    version: "1.0.0",
    cache: {
        enabled: true,
        tags: ["filters"],
    },
    preset: {
        country,
        zones,
        years: {},
        segments: {
            filters: [{ name: "scope", value: "category_health" }],
        },
    },
};
exports.default = config;
//# sourceMappingURL=category-health.preset.js.map