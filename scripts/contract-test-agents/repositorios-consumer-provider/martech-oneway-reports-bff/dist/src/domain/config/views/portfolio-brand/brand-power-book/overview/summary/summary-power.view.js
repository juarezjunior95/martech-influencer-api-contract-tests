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
                name: "period_type",
            },
        ],
    },
    components: [
        {
            id: "summaryPowerByPortfolioPerformance",
            formatter: "portfolio-brand/brand-power-book/overview/summary/portfolioPerformanceFormatter",
            datasources: [
                {
                    name: "portfolio-brand_brand-power-book_overview_power-performance",
                    filters: [
                        {
                            name: "visual",
                            defaultValue: "portfolio",
                        },
                        {
                            name: "period_type",
                            defaultValue: "",
                        },
                        {
                            name: "viewtype",
                            defaultValue: "",
                        },
                        {
                            name: "page_filter",
                            defaultValue: "",
                        },
                    ],
                },
            ],
        },
        {
            id: "summaryPowerBySegmentPerformance",
            formatter: "portfolio-brand/brand-power-book/overview/summary/segmentPerformanceFormatter",
            datasources: [
                {
                    name: "portfolio-brand_brand-power-book_overview_power-performance",
                    filters: [
                        {
                            name: "visual",
                            defaultValue: "segment",
                        },
                        {
                            name: "period_type",
                            defaultValue: "",
                        },
                        {
                            name: "viewtype",
                            defaultValue: "",
                        },
                        {
                            name: "page_filter",
                            defaultValue: "",
                        },
                    ],
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=summary-power.view.js.map