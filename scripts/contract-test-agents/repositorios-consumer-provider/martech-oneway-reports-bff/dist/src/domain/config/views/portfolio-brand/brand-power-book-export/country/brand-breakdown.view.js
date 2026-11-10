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
                name: "country",
            },
            {
                name: "zone",
            },
            {
                name: "page_filter",
            },
            {
                name: "period_type",
            },
        ],
    },
    components: [
        {
            id: "brandBreakdown",
            formatter: "portfolio-brand/brand-power-book-export/brand-breakdown/brandBreakdown",
            datasources: [
                {
                    name: "portfolio-brand_brand-power-book_overview_summary-power_by-brand-breakdown",
                    filters: [
                        {
                            name: "visual",
                            defaultValue: "BRAND",
                        },
                        {
                            name: "period_type",
                            defaultValue: "QTD",
                        },
                        {
                            name: "zone_maturity",
                            defaultValue: "",
                        },
                    ],
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=brand-breakdown.view.js.map