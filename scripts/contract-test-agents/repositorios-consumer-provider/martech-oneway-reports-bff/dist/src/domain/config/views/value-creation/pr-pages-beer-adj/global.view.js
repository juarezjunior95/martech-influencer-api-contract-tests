"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commonFilters = [
    {
        name: "dt_end",
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
            id: "big-numbers-global",
            formatter: "value-creation/pr-pages/volume/big-numbers",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_big-numbers",
                    filters: [
                        {
                            name: "growth_lever",
                            defaultValue: "All",
                        },
                        {
                            name: "kpi",
                            defaultValue: "volume",
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
                            name: "country",
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
            id: "line-chart-global",
            formatter: "value-creation/pr-pages/volume/brands-by-segments/line-chart",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_line-chart",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Global",
                        },
                        {
                            name: "country",
                            defaultValue: "ABI",
                        },
                        {
                            name: "zone",
                            defaultValue: "ABI",
                        },
                        {
                            name: "kpi",
                        },
                        {
                            name: "period_type",
                            defaultValue: "All",
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
            id: "portfolio",
            formatter: "value-creation/pr-pages-beer-adj/portfolio",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_portfolio",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Global - Portfolio",
                        },
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
        {
            id: "growth-levers-priorities",
            formatter: "value-creation/pr-pages/volume/growth-levers",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_growth-levers",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Growth Levers Global",
                        },
                        {
                            name: "dt_end",
                        },
                        {
                            name: "kpi",
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
            id: "must-win-markets",
            formatter: "value-creation/pr-pages/volume/must-win-markets",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_must-win-markets",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Global",
                        },
                        {
                            name: "country",
                            defaultValue: "WIN",
                        },
                        {
                            name: "kpi",
                        },
                    ],
                },
            ],
        },
        {
            id: "country-MTD",
            formatter: "value-creation/pr-pages/volume/segments-gb/mtd-by-country",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_segments-gb_mtd-by-country",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Global",
                        },
                        {
                            name: "period",
                            defaultValue: "MTD",
                        },
                        {
                            name: "dt_end",
                        },
                    ],
                },
            ],
        },
        {
            id: "country-YTD",
            formatter: "value-creation/pr-pages/volume/segments-gb/mtd-by-country",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume-beer-adj_segments-gb_mtd-by-country",
                    filters: [
                        {
                            name: "page_type",
                            defaultValue: "Global",
                        },
                        {
                            name: "period",
                            defaultValue: "YTD",
                        },
                        {
                            name: "dt_end",
                        },
                    ],
                },
            ],
        },
        {
            id: "brand-top-YTD",
            formatter: "value-creation/pr-pages/volume/top-bottom-brands",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume_top-bottom-brands",
                    filters: [
                        {
                            name: "growth_lever",
                            defaultValue: "All",
                        },
                        {
                            name: "view_level",
                            defaultValue: "Growth Levers Global",
                        },
                        {
                            name: "country",
                            defaultValue: "ABI",
                        },
                        {
                            name: "page_type",
                            defaultValue: "top",
                        },
                        {
                            name: "period",
                            defaultValue: "YTD",
                        },
                        {
                            name: "kpi",
                        },
                        {
                            name: "reporttype",
                        },
                    ],
                },
            ],
        },
        {
            id: "brand-bottom-YTD",
            formatter: "value-creation/pr-pages/volume/top-bottom-brands",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume_top-bottom-brands",
                    filters: [
                        {
                            name: "growth_lever",
                            defaultValue: "All",
                        },
                        {
                            name: "view_level",
                            defaultValue: "Growth Levers Global",
                        },
                        {
                            name: "country",
                            defaultValue: "ABI",
                        },
                        {
                            name: "page_type",
                            defaultValue: "bottom",
                        },
                        {
                            name: "period",
                            defaultValue: "YTD",
                        },
                        {
                            name: "kpi",
                        },
                        {
                            name: "reporttype",
                        },
                    ],
                },
            ],
        },
        {
            id: "brand-top-MTD",
            formatter: "value-creation/pr-pages/volume/top-bottom-brands",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume_top-bottom-brands",
                    filters: [
                        {
                            name: "growth_lever",
                            defaultValue: "All",
                        },
                        {
                            name: "view_level",
                            defaultValue: "Growth Levers Global",
                        },
                        {
                            name: "country",
                            defaultValue: "ABI",
                        },
                        {
                            name: "page_type",
                            defaultValue: "top",
                        },
                        {
                            name: "period",
                            defaultValue: "MTD",
                        },
                        {
                            name: "kpi",
                        },
                        {
                            name: "reporttype",
                        },
                    ],
                },
            ],
        },
        {
            id: "brand-bottom-MTD",
            formatter: "value-creation/pr-pages/volume/top-bottom-brands",
            datasources: [
                {
                    name: "value-creation_pr-pages_volume_top-bottom-brands",
                    filters: [
                        {
                            name: "growth_lever",
                            defaultValue: "All",
                        },
                        {
                            name: "view_level",
                            defaultValue: "Growth Levers Global",
                        },
                        {
                            name: "country",
                            defaultValue: "ABI",
                        },
                        {
                            name: "page_type",
                            defaultValue: "bottom",
                        },
                        {
                            name: "period",
                            defaultValue: "MTD",
                        },
                        {
                            name: "kpi",
                        },
                        {
                            name: "reporttype",
                        },
                    ],
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=global.view.js.map