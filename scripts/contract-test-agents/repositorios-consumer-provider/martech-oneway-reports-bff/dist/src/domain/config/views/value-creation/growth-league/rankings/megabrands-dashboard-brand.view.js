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
            id: "megabrands-dashboard-brand",
            formatter: "value-creation/growth-league/rankings/megabrands-dashboard-brand",
            datasources: [
                {
                    name: "value-creation_growth-league_rankings_megabrands-dashboard-brand",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=megabrands-dashboard-brand.view.js.map