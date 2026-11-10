"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    version: "1.0.0",
    cache: {
        enabled: true,
        tags: ["default"],
    },
    filters: {
        default: [
            {
                name: "dt_end",
            },
            {
                name: "dt_ini",
            },
        ],
    },
    components: [
        {
            id: "megabrands-dashboard-country",
            formatter: "value-creation/growth-league/rankings/megabrands-dashboard-country",
            datasources: [
                {
                    name: "value-creation_growth-league_rankings_megabrands-dashboard-country",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=megabrands-dashboard-country.view.js.map