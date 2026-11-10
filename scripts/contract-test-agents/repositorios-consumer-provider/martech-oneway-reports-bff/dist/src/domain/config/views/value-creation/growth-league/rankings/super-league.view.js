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
            id: "super-league",
            formatter: "value-creation/growth-league/rankings/super-league",
            datasources: [
                {
                    name: "value-creation_growth-league_rankings_super-league",
                },
                {
                    name: "value-creation_growth-league_rankings_super-league-leaderboard",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=super-league.view.js.map