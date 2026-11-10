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
            id: "cup-winners",
            formatter: "value-creation/growth-league/overview/cup-winners",
            datasources: [
                {
                    name: "value-creation_growth-league_overview_cup-winners",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=cup-winners.view.js.map