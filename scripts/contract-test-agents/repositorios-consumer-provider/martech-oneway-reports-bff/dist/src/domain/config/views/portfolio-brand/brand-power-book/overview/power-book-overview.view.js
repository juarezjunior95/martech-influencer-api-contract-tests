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
                name: "country",
            },
            {
                name: "zone",
            },
            {
                name: "page_filter",
            },
            {
                name: "viewtype",
            },
            {
                name: "period_type",
            },
        ],
    },
    components: [
        {
            id: "powerVsLy",
            formatter: "portfolio-brand/brand-power-book-export/bigNumbers/powerVsLyExportFormatter/powerVsLyExportFormatter",
            datasources: [
                {
                    name: "portfolio-brand_brand-power-book_overview_overview_big-numbers",
                },
            ],
        },
        {
            id: "powerVsLq",
            formatter: "portfolio-brand/brand-power-book-export/bigNumbers/powerVsLqExportFormatter/powerVsLqExportFormatter",
            datasources: [
                {
                    name: "portfolio-brand_brand-power-book_overview_overview_big-numbers",
                },
            ],
        },
        {
            id: "trendOverTime",
            formatter: "portfolio-brand/brand-power-book/overview/power-book-overview/trendOverTimeFormatter",
            datasources: [
                {
                    name: "portfolio-brand_brand-power-book_overview_power-performance-trend_by-trend-over-time-power-mix",
                },
                {
                    name: "portfolio-brand_brand-power-book_overview_power-performance-trend_by-trend-over-time",
                },
            ],
        },
        {
            id: "yearPowerVsAc",
            formatter: "portfolio-brand/brand-power-book/overview/power-book-overview/yearPowerAcFormatter",
            datasources: [
                {
                    name: "portfolio-brand_brand-power-book_overview_power-performance-trend_year-by-year-power-ac-power-mix",
                },
                {
                    name: "portfolio-brand_brand-power-book_overview_power-performance-trend_by-year-power-ac",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=power-book-overview.view.js.map