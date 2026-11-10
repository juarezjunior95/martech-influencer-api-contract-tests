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
            id: "zonePowerPerformance",
            formatter: "portfolio-brand/brand-power-book-export/performance-breakdown/exportZonePowerPerformanceFormatter",
            datasources: [
                {
                    name: "portfolio-brand_brand-power-book_overview_power-performance",
                    filters: [
                        {
                            name: "visual",
                            defaultValue: "zone",
                        },
                        {
                            name: "period_type",
                            defaultValue: "",
                        },
                        {
                            name: "country",
                            defaultValue: "",
                        },
                    ],
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=zone-performance.view.js.map