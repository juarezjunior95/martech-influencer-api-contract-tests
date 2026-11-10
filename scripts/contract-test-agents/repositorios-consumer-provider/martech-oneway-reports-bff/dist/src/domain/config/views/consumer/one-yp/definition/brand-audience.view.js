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
            {
                name: "product_type",
            },
            {
                name: "age",
            },
            {
                name: "gender",
            },
            {
                name: "socio_economic_level",
            },
            {
                name: "competitor",
            },
        ],
    },
    components: [
        {
            id: "one-yp-audience-cards",
            formatter: "consumer/one-yp/definition/audience-cards",
            datasources: [
                {
                    name: "consumer_one-yp_definition_brand-audience",
                    filters: [
                        {
                            name: "product_type",
                            defaultValue: "Beer",
                        },
                        {
                            name: "age",
                            defaultValue: "All",
                        },
                        {
                            name: "gender",
                            defaultValue: "All",
                        },
                        {
                            name: "socio_economic_level",
                            defaultValue: "All",
                        },
                    ],
                },
            ],
        },
        {
            id: "one-yp-participation-breakdown",
            formatter: "consumer/one-yp/definition/participation-breakdown",
            datasources: [
                {
                    name: "consumer_one-yp_definition_participation-breakdown",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=brand-audience.view.js.map