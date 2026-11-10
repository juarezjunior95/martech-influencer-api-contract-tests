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
                name: "timeperiod",
            },
            {
                name: "dt_end",
            },
        ],
    },
    components: [
        {
            id: "consumer-behavior",
            formatter: "category/home/consumer-behavior",
            datasources: [
                {
                    name: "category_home_consumer-behavior",
                    filters: [
                        {
                            name: "environment",
                            defaultValue: process.env.NEW_RELIC_APP_NAME ===
                                "martech-oneway-reports-bff-uat"
                                ? "UAT"
                                : "PRD",
                        },
                    ],
                },
            ],
        },
        {
            id: "grow-the-category",
            formatter: "category/home/grow-the-category",
            datasources: [
                {
                    name: "category_home_grow-the-category",
                },
            ],
        },
        {
            id: "lead-the-category",
            formatter: "category/home/lead-the-category",
            datasources: [
                {
                    name: "category_home_lead-the-category",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=home.view.js.map