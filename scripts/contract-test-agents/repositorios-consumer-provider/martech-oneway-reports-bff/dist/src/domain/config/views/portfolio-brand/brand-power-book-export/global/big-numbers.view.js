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
                name: "country",
            },
            {
                name: "dt_end",
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
            id: "big-numbers-ly",
            formatter: "portfolio-brand/brand-power-book-export/bigNumbers/powerVsLyExportFormatter/powerVsLyExportFormatter",
            datasources: [
                {
                    name: "portfolio-brand_brand-power-book_overview_overview_big-numbers",
                },
            ],
        },
        {
            id: "big-numbers-lq",
            formatter: "portfolio-brand/brand-power-book-export/bigNumbers/powerVsLqExportFormatter/powerVsLqExportFormatter",
            datasources: [
                {
                    name: "portfolio-brand_brand-power-book_overview_overview_big-numbers",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=big-numbers.view.js.map