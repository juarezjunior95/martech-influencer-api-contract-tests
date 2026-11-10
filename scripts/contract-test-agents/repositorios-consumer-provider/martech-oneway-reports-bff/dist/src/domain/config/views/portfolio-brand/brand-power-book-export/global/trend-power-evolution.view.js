"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    version: "1.0.0",
    cache: {
        enabled: true,
        tags: ["power-results-export"],
    },
    filters: {
        default: [
            {
                name: "dt_end",
            },
            {
                name: "viewtype",
            },
            {
                name: "page_filter",
            },
            {
                name: "country",
            },
            {
                name: "zone",
            },
        ],
    },
    components: [
        {
            id: "trend-over-time",
            formatter: "portfolio-brand/brand-power-book-export/performance-trend/trendOverTimeExportFormatter",
            datasources: [
                {
                    name: "portfolio-brand_brand-power-book_overview_power-performance-trend_by-trend-over-time",
                },
                {
                    name: "portfolio-brand_brand-power-book_overview_power-performance-trend_by-year-power-ac",
                },
                {
                    name: "portfolio-brand_brand-power-book_overview_power-performance-trend_year-by-year-power-ac-power-mix",
                },
                {
                    name: "portfolio-brand_brand-power-book_overview_power-performance-trend_by-trend-over-time-power-mix",
                },
            ],
        },
        {
            id: "year-power-vs-ac",
            formatter: "portfolio-brand/brand-power-book-export/performance-trend/yearPowerVsAcExportFormatter",
            datasources: [
                {
                    name: "portfolio-brand_brand-power-book_overview_power-performance-trend_by-trend-over-time",
                },
                {
                    name: "portfolio-brand_brand-power-book_overview_power-performance-trend_by-year-power-ac",
                },
                {
                    name: "portfolio-brand_brand-power-book_overview_power-performance-trend_year-by-year-power-ac-power-mix",
                },
                {
                    name: "portfolio-brand_brand-power-book_overview_power-performance-trend_by-trend-over-time-power-mix",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=trend-power-evolution.view.js.map