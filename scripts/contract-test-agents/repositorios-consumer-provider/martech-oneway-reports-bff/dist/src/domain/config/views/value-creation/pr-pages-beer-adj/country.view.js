"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commonFilters = [
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
        name: "page_type",
    },
];
const bigNumbersFilters = [
    {
        name: "dt_end",
    },
    {
        name: "zone",
    },
    {
        name: "country",
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
        bigNumbers: bigNumbersFilters,
    },
    components: [
        {
            id: "big-numbers",
            formatter: "value-creation/pr-pages/volume/big-numbers",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_big-numbers",
                    filterSet: "bigNumbers",
                    filters: [
                        {
                            name: "growth_lever",
                            defaultValue: "All",
                        },
                        {
                            name: "kpi",
                        },
                        {
                            name: "brand",
                            defaultValue: "All",
                        },
                        {
                            name: "sub_brand",
                            defaultValue: "All",
                        },
                        {
                            name: "page_filter",
                            defaultValue: "All",
                        },
                        {
                            name: "waterfall_filter",
                            defaultValue: "country",
                        },
                    ],
                },
            ],
        },
        {
            id: "line-chart",
            formatter: "value-creation/pr-pages/volume/brands-by-segments/line-chart",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_line-chart",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Country",
                        },
                        {
                            name: "country",
                            defaultValue: "ABI",
                        },
                        {
                            name: "kpi",
                            defaultValue: "volume",
                        },
                        {
                            name: "period_type",
                            defaultValue: "MTD",
                        },
                        {
                            name: "growth_lever",
                            defaultValue: "All",
                        },
                        {
                            name: "brand",
                            defaultValue: "All",
                        },
                        {
                            name: "sub_brand",
                            defaultValue: "All",
                        },
                        {
                            name: "zone",
                            defaultValue: "ABI",
                        },
                        {
                            name: "page_filter",
                            defaultValue: "All",
                        },
                        {
                            name: "waterfall_filter",
                            defaultValue: "All",
                        },
                    ],
                },
            ],
        },
        {
            id: "growth-levers",
            formatter: "value-creation/pr-pages/volume/growth-levers",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_growth-levers",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Growth Levers Country",
                        },
                        {
                            name: "viewtype",
                            defaultValue: "country",
                        },
                        {
                            name: "country",
                            defaultValue: "ABI",
                        },
                    ],
                },
            ],
        },
        {
            id: "portfolio",
            formatter: "value-creation/pr-pages-beer-adj/portfolio",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_portfolio",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Country - Portfolio",
                        },
                        {
                            name: "kpi",
                        },
                    ],
                },
            ],
        },
        {
            id: "brands-volume-MTD",
            formatter: "value-creation/pr-pages/volume/div-by-brands",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_div-by-brands",
                    filters: [
                        {
                            name: "period_type",
                            defaultValue: "MTD",
                        },
                    ],
                },
            ],
        },
        {
            id: "brands-volume-YTD",
            formatter: "value-creation/pr-pages/volume/div-by-brands",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_div-by-brands",
                    filters: [
                        {
                            name: "period_type",
                            defaultValue: "YTD",
                        },
                    ],
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=country.view.js.map