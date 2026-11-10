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
                name: "dt_ini",
            },
            {
                name: "country",
            },
        ],
    },
    components: [
        {
            id: "pl-brand",
            formatter: "value-creation/portfolio-performance/pl/plFormatter",
            datasources: [
                {
                    name: "value-creation_portfolio-performance_pl_brand_growth-contribution",
                },
                {
                    name: "value-creation_portfolio-performance_pl_brand_volume",
                },
                {
                    name: "value-creation_portfolio-performance_pl_brand_output",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=brand.view.js.map