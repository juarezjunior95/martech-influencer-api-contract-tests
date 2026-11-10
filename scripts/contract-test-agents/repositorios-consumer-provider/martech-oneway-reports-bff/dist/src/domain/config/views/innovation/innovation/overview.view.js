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
                name: "country",
            },
            {
                name: "dt_end",
            },
        ],
        "portfolio-health": [
            {
                name: "dt_end",
            },
            {
                name: "country",
            },
            {
                name: "viewtype",
            },
        ],
        "pillar-rennovation": [
            {
                name: "viewtype",
            },
            {
                name: "country",
            },
            {
                name: "dt_end",
            },
        ],
    },
    components: [
        {
            id: "big-numbers",
            formatter: "innovation/innovation/overview/big-numbers",
            datasources: [
                {
                    name: "innovation_innovation_overview_big-numbers",
                    filters: [
                        {
                            name: "kpi",
                            defaultValue: "all",
                        },
                    ],
                },
            ],
        },
        {
            id: "strategic-innovation-pillars",
            formatter: "innovation/innovation/overview/strategic-innovation-pillars",
            datasources: [
                {
                    name: "innovation_innovation_overview_strategic-innovation-pillars",
                    title: "strategic-innovation-pillars-renovation",
                    filterSet: "pillar-rennovation",
                    filters: [
                        {
                            name: "kpi",
                            defaultValue: "renovation",
                        },
                    ],
                },
                {
                    name: "innovation_innovation_overview_strategic-innovation-pillars",
                    title: "strategic-innovation-pillars-pack-price",
                    filters: [
                        {
                            name: "kpi",
                            defaultValue: "pack_price",
                        },
                    ],
                },
                {
                    name: "innovation_innovation_overview_strategic-innovation-pillars",
                    title: "strategic-innovation-pillars-new-opportunities",
                    filters: [
                        {
                            name: "kpi",
                            defaultValue: "new_opportunities",
                        },
                    ],
                },
                {
                    name: "innovation_innovation_overview_portfolio-health-phi",
                    filterSet: "portfolio-health",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=overview.view.js.map