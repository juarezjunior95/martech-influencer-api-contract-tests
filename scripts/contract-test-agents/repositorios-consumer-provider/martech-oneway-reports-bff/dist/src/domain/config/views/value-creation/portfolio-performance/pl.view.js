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
            {
                name: "viewtype",
            },
            {
                name: "period",
            },
        ],
    },
    components: [
        {
            id: "plPortfolio",
            formatter: "value-creation/portfolio-performance/pl/plPortfolioFormatter",
            datasources: [
                {
                    name: "value-creation_portfolio-performance_pl_portfolio",
                },
            ],
        },
        {
            id: "plDeepDive",
            formatter: "value-creation/portfolio-performance/pl/plDeepDiveFormatter",
            datasources: [
                {
                    name: "value-creation_portfolio-performance_pl_deep-dive",
                },
            ],
        },
        {
            id: "plBrand",
            formatter: "value-creation/portfolio-performance/pl/plBrandFormatter",
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
//# sourceMappingURL=pl.view.js.map