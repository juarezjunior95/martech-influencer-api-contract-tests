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
            id: "ka-dashboard-league-b",
            formatter: "value-creation/growth-league/rankings/ka-dashboard-league-b",
            datasources: [
                {
                    name: "value-creation_growth-league_rankings_ka-dashboard-league-b",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=ka-dashboard-league-b.view.js.map