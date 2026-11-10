"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    version: "1.0.0",
    cache: {
        enabled: true,
        tags: ["default"],
    },
    filters: {
        default: [],
    },
    components: [
        {
            id: "league-champions",
            formatter: "value-creation/growth-league/overview/league-champions",
            datasources: [
                {
                    name: "value-creation_growth-league_overview_league-champions",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=league-champions.view.js.map