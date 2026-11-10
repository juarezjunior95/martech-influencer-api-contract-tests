"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zone_country_builder_1 = require("../common/zone-country.builder");
const time_frame_builder_1 = require("../common/time-frame.builder");
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
        ...(0, time_frame_builder_1.buildTimeFrameFilters)(),
        periods: {
            filters: [{ name: "scope", value: "R12M" }],
        },
        "audience-targeting-brands": {
            filters: [],
            formatter: "presets/filter-name-normalization",
        },
        segments: {
            filters: [{ name: "scope", value: "audience_targeting" }],
        },
    },
};
exports.default = config;
//# sourceMappingURL=audience-targeting-definition.preset.js.map