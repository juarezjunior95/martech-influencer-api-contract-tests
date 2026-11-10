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
                name: "dt_end",
            },
            {
                name: "timeperiod",
            },
            {
                name: "cohort",
            },
            {
                name: "country",
            },
        ],
    },
    components: [
        {
            id: "participation-ranking",
            formatter: "category/pos-book/lead-the-category/country/participation-ranking",
            datasources: [
                {
                    name: "category_pos-book_lead-the-category_country_participation-ranking",
                    filters: [
                        {
                            name: "price_segment",
                            defaultValue: "All",
                        },
                    ],
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=participation-ranking.view.js.map