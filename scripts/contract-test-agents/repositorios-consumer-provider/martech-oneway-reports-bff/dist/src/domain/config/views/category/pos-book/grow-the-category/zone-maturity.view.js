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
                name: "pos_kpi",
            },
            {
                name: "timeperiod",
            },
            {
                name: "dt_end",
            },
            {
                name: "cohort",
            },
        ],
    },
    components: [
        {
            id: "country",
            formatter: "category/pos-book/grow-the-category/maturity",
            datasources: [
                {
                    name: "category_pos-book_grow-the-category_maturity",
                },
                {
                    name: "category_pos-book_grow-the-category_zone",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=zone-maturity.view.js.map