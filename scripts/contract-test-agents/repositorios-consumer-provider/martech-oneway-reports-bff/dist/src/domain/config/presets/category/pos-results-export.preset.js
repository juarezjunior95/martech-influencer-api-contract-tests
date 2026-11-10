"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zone_country_builder_1 = require("../common/zone-country.builder");
const country_scopes_1 = require("../common/country-scopes");
const { zones, country } = (0, zone_country_builder_1.buildZoneCountryFilters)({
    scope: { countries: country_scopes_1.POS_BOOK_SCOPE },
    page: "category_pos-results-export",
    hideGlobalForKpi: "pos",
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
        "pos-periods": {
            filters: [],
            formatter: "presets/pos-tool-overview",
        },
        "time-frame": {
            filters: [],
            formatter: "presets/pos-results-export-time-frame",
        },
    },
};
exports.default = config;
//# sourceMappingURL=pos-results-export.preset.js.map