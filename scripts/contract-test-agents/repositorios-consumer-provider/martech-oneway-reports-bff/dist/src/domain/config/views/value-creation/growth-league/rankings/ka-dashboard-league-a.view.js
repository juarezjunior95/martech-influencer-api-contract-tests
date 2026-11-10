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
            id: "ka-dashboard-league-a",
            formatter: "value-creation/growth-league/rankings/ka-dashboard-league-a",
            datasources: [
                {
                    name: "value-creation_growth-league_rankings_ka-dashboard-league-a",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=ka-dashboard-league-a.view.js.map