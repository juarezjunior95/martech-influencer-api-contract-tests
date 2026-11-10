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
                name: "country",
            },
            {
                name: "viewtype",
            },
            {
                name: "region",
            },
        ],
    },
    components: [
        {
            id: "total-distribution",
            formatter: "trade-execution/bees-distribution/overview",
            datasources: [
                {
                    name: "trade-execution_bees-distribution_overview_overview",
                    filters: [
                        {
                            name: "pageview",
                            defaultValue: "distribution",
                        },
                    ],
                },
            ],
        },
        {
            id: "total-buyers",
            formatter: "trade-execution/bees-distribution/overview",
            datasources: [
                {
                    name: "trade-execution_bees-distribution_overview_overview",
                    filters: [
                        {
                            name: "pageview",
                            defaultValue: "bees buyers",
                        },
                    ],
                },
            ],
        },
        {
            id: "sku-per-poc",
            formatter: "trade-execution/bees-distribution/overview",
            datasources: [
                {
                    name: "trade-execution_bees-distribution_overview_overview",
                    filters: [
                        {
                            name: "pageview",
                            defaultValue: "sku per poc",
                        },
                    ],
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=overview.view.js.map