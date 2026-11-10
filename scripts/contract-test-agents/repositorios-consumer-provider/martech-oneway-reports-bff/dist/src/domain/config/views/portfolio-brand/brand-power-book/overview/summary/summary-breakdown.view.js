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
                name: "period_type",
            },
        ],
    },
    components: [
        {
            id: "summaryPowerBreakdown",
            formatter: "portfolio-brand/brand-power-book/overview/summary/summaryPowerBreakdownFormatter",
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
        {
            id: "summaryPowerBreakdownComp",
            formatter: "portfolio-brand/brand-power-book/overview/summary/summaryPowerBreakdownCompFormatter",
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
//# sourceMappingURL=summary-breakdown.view.js.map