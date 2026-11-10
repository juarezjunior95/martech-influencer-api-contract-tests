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
                name: "brand",
            },
            {
                name: "country",
            },
        ],
    },
    components: [
        {
            id: "audience-cards",
            formatter: "consumer/audience-targeting/definition/audience-cards",
            datasources: [
                {
                    name: "consumer_audience-targeting_definition_brand-audience",
                },
            ],
        },
        {
            id: "participation-breakdown",
            formatter: "consumer/audience-targeting/definition/participation-breakdown",
            datasources: [
                {
                    name: "consumer_audience-targeting_definition_participation-breakdown",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=brand-audience.view.js.map