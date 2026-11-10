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
                name: "country",
            },
            {
                name: "viewtype",
            },
            {
                name: "brand",
            },
            {
                name: "sub_brand",
            },
            {
                name: "timeframe",
            },
            {
                name: "kpi",
            },
            {
                name: "region",
            },
            {
                name: "channel",
            },
            {
                name: "waterfall_filter",
            },
            {
                name: "sku",
            },
            {
                name: "pack_type",
            },
            {
                name: "category",
            },
            {
                name: "non_alcoholic",
            },
            {
                name: "growth_levers",
            },
            {
                name: "beer_price_segment",
            },
            {
                name: "portfolios",
            },
            {
                name: "period_type",
            },
        ],
    },
    components: [
        {
            id: "contribution",
            formatter: "value-creation/commercial-results/waterfall",
            datasources: [
                {
                    name: "value-creation_commercial-results_waterfall",
                    title: "large",
                    filters: [
                        {
                            name: "max_ranked",
                            defaultValue: 15,
                        },
                        {
                            name: "kpi",
                            defaultValue: "volume",
                        },
                    ],
                },
                {
                    name: "value-creation_commercial-results_waterfall",
                    title: "small",
                    filters: [
                        {
                            name: "max_ranked",
                            defaultValue: 10,
                        },
                        {
                            name: "kpi",
                            defaultValue: "volume",
                        },
                    ],
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=waterfall.view.js.map