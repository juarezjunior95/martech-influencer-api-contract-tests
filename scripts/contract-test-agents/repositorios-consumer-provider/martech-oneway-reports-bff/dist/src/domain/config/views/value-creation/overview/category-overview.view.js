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
                name: "zone",
            },
            {
                name: "viewtype",
            },
        ],
    },
    components: [
        {
            id: "category-overview",
            formatter: "value-creation/overview/category-overview",
            datasources: [
                {
                    name: "value-creation_portfolio-performance_overview_category-growth-levers_beer-participation",
                },
                {
                    name: "value-creation_portfolio-performance_overview_category-growth-levers_superior-core",
                },
                {
                    name: "value-creation_portfolio-performance_overview_category-growth-levers_occasions-development",
                },
                {
                    name: "value-creation_portfolio-performance_overview_category-growth-levers_premiumization",
                },
                {
                    name: "value-creation_portfolio-performance_overview_category-growth-levers_beyond-beer",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=category-overview.view.js.map