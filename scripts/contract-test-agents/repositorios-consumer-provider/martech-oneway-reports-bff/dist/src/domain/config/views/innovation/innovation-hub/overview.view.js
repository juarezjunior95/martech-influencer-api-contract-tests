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
                name: "viewtype",
            },
            {
                name: "zone",
            },
            {
                name: "country",
            },
            {
                name: "dt_end",
            },
            {
                name: "period_type",
            },
        ],
    },
    components: [
        {
            id: "innovation-hub-overview-portfolio-pie-charts",
            formatter: "innovation/innovation-hub/overview/portfolio-pie-charts",
            datasources: [
                {
                    name: "innovation_innovation-hub_overview_portfolio-pie-charts",
                },
            ],
        },
        {
            id: "innovation-hub-overview-portfolio-big-numbers",
            formatter: "innovation/innovation-hub/overview/portfolio-big-numbers",
            datasources: [
                {
                    name: "innovation_innovation-hub_overview_portfolio-big-numbers",
                },
            ],
        },
        {
            id: "innovation-hub-overview-main-cards",
            formatter: "innovation/innovation-hub/overview/main-cards",
            datasources: [
                {
                    name: "innovation_innovation-hub_overview_main-cards",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=overview.view.js.map