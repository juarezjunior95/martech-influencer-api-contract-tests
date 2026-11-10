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
                name: "zone_maturity",
            },
            {
                name: "viewtype",
            },
            {
                name: "page_filter",
            },
            {
                name: "dt_end",
            },
            {
                name: "period_type",
            },
        ],
    },
    components: [
        {
            id: "performanceDetails",
            formatter: "portfolio-brand/brand-power-book/overview/performance-breakdown/performanceDetailsFormatter",
            datasources: [
                {
                    name: "portfolio-brand_brand-power-book_overview_performance-breakdown_by-zone-maturity-performance-details",
                    filters: [
                        {
                            name: "visual",
                            defaultValue: "COUNTRY",
                        },
                        {
                            name: "period_type",
                            defaultValue: "QTD",
                        },
                    ],
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=zone-maturity-details.view.js.map