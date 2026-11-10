"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zone_country_builder_1 = require("../common/zone-country.builder");
const country_scopes_1 = require("../common/country-scopes");
const { zones, country } = (0, zone_country_builder_1.buildZoneCountryFilters)({
    scope: { countries: country_scopes_1.BEES_DISTRIBUTION_COUNTRIES },
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
        periods: {
            filters: [{ name: "scope", value: "YTD" }],
        },
    },
};
exports.default = config;
//# sourceMappingURL=home.preset.js.map