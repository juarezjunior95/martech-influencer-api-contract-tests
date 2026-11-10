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
            id: "premier-league",
            formatter: "value-creation/growth-league/rankings/premier-league",
            datasources: [
                {
                    name: "value-creation_growth-league_rankings_premier-league",
                },
                {
                    name: "value-creation_growth-league_rankings_premier-league-leaderboard",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=premier-league.view.js.map