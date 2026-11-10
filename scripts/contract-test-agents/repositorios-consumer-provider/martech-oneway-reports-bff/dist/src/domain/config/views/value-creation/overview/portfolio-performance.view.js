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
            id: "portfolio-performance",
            formatter: "value-creation/overview/portfolio-performance",
            datasources: [
                {
                    name: "value-creation_portfolio-performance_overview_portfolio-performance_volume",
                },
                {
                    name: "value-creation_portfolio-performance_overview_portfolio-performance_vs-ly",
                },
                {
                    name: "value-creation_portfolio-performance_overview_portfolio-performance_brands",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=portfolio-performance.view.js.map