"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ZONES = ["NAZ", "SAZ", "MAZ", "APAC", "AFR", "EUR"];
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
    components: ZONES.map((zone) => ({
        id: zone,
        formatter: "portfolio-brand/brand-power-book-export/performance-breakdown/exportPerformanceDetailsFormatter",
        datasources: [
            {
                name: "portfolio-brand_brand-power-book_overview_performance-breakdown_by-zone-maturity-performance-details",
                filters: [
                    {
                        name: "zone_maturity",
                        defaultValue: zone,
                    },
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
    })),
};
exports.default = config;
//# sourceMappingURL=zone-performance-details.view.js.map