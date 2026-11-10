"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zone_country_builder_1 = require("../common/zone-country.builder");
const country_scopes_1 = require("../common/country-scopes");
const { zones, country } = (0, zone_country_builder_1.buildZoneCountryFilters)({
    scope: {
        countries: country_scopes_1.POS_BOOK_SCOPE,
    },
    page: "category_pos-tool-overview",
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
        segments: {
            filters: [{ name: "scope", value: "pos_tool_overview" }],
        },
    },
};
exports.default = config;
//# sourceMappingURL=pos-tool-overview.preset.js.map