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
            id: "rank",
            formatter: "value-creation/growth-league/overview/rank",
            datasources: [
                {
                    name: "value-creation_growth-league_overview_rank",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=rank.view.js.map