"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commonFilters = [
    {
        name: "dt_end",
    },
    {
        name: "page_type",
    },
];
const config = {
    version: "1.0.0",
    cache: {
        enabled: true,
        tags: ["default"],
    },
    filters: {
        default: commonFilters,
    },
    components: [
        {
            id: "portfolio",
            formatter: "value-creation/pr-pages-beer-adj/portfolio",
            datasources: [
                {
                    name: "value-creation_pr-pages-beer-adj_volume_portfolio",
                    filters: [
                        {
                            name: "country",
                            defaultValue: "ABI",
                        },
                        {
                            name: "kpi",
                        },
                    ],
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=portfolio.view.js.map