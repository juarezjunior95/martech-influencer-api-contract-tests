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
            id: "big-numbers",
            formatter: "value-creation/commercial-results/big-numbers",
            datasources: [
                {
                    name: "value-creation_commercial-results_big-numbers",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=big-numbers.view.js.map