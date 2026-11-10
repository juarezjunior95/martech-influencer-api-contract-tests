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
                name: "price_segment",
            },
            {
                name: "timeperiod",
            },
            {
                name: "dt_end",
            },
        ],
    },
    components: [
        {
            id: "manufacture-participation",
            formatter: "category/pos-book/lead-the-category/global/manufacture-participation",
            datasources: [
                {
                    name: "category_pos-book_lead-the-category_global_manufacture-participation",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=manufacture-participation.view.js.map