"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const time_frame_builder_1 = require("../common/time-frame.builder");
const country_scopes_1 = require("../common/country-scopes");
const zone_country_builder_1 = require("../common/zone-country.builder");
const { zones, country } = (0, zone_country_builder_1.buildZoneCountryFilters)({
    scope: { countries: country_scopes_1.BRAND_ANALYSIS_SCOPE },
    hideGlobalForKpi: "power",
});
const config = {
    version: "1.0.0",
    cache: {
        enabled: true,
        tags: ["filters"],
    },
    preset: {
        "brands-abi": { formatter: "presets/filter-name-normalization" },
        "brands-comp": { formatter: "presets/filter-name-normalization" },
        country,
        ...(0, time_frame_builder_1.buildTimeFrameFilters)(),
        zones,
    },
};
exports.default = config;
//# sourceMappingURL=brand-analysis-brand-power.preset.js.map