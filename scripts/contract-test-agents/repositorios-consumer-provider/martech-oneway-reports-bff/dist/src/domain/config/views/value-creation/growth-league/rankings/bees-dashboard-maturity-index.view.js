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
            id: "bees-dashboard-maturity-index",
            formatter: "value-creation/growth-league/rankings/bees-dashboard-maturity-index",
            datasources: [
                {
                    name: "value-creation_growth-league_rankings_bees-dashboard-maturity-index",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=bees-dashboard-maturity-index.view.js.map