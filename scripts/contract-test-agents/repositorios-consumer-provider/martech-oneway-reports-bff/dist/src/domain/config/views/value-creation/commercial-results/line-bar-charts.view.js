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
                name: "period_type",
            },
            {
                name: "country",
            },
            {
                name: "region",
            },
            {
                name: "brand",
            },
            {
                name: "sub_brand",
            },
            {
                name: "sku",
            },
            {
                name: "pack_type",
            },
            {
                name: "channel",
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
        ],
    },
    components: [
        {
            id: "line-bar-charts",
            formatter: "value-creation/commercial-results/line-bar-charts",
            datasources: [
                {
                    name: "value-creation_commercial-results_line-chart",
                },
                {
                    name: "value-creation_commercial-results_bar-chart",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=line-bar-charts.view.js.map