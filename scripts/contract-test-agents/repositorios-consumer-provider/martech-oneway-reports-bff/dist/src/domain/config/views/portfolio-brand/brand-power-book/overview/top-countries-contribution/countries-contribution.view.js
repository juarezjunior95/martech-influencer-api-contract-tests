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
                name: "page_filter",
            },
            {
                name: "period_type",
            },
        ],
    },
    components: [
        {
            id: "countriesContribution",
            formatter: "portfolio-brand/brand-power-book/overview/countries-contribution/countriesContributionFormatter",
            datasources: [
                {
                    name: "portfolio-brand_brand-power-book_overview_top-countries-contribution_countries-contribution",
                    filters: [
                        {
                            name: "period_type",
                            defaultValue: "",
                        },
                    ],
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=countries-contribution.view.js.map