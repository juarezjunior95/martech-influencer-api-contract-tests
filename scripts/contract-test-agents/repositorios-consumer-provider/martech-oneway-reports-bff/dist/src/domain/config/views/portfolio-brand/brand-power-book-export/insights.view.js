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
                name: "period",
            },
            {
                name: "scope",
            },
            {
                name: "segmented_control",
            },
            {
                name: "sub_scope",
            },
            {
                name: "template",
            },
            {
                name: "timeframe",
            },
            {
                name: "type",
            },
            {
                name: "zone",
            },
            {
                name: "country",
            },
            {
                name: "insights_title",
            },
        ],
    },
    components: [
        {
            id: "insights",
            formatter: "portfolio-brand/brand-power-book-export/insights",
            datasources: [
                {
                    name: "portfolio-brand_brand-power-book-export_insights",
                    filters: [
                        {
                            name: "period",
                        },
                        {
                            name: "scope",
                            defaultValue: "All",
                        },
                        {
                            name: "segmented_control",
                            defaultValue: "All",
                        },
                        {
                            name: "sub_scope",
                            defaultValue: "All",
                        },
                        {
                            name: "template",
                            defaultValue: "All",
                        },
                        {
                            name: "timeframe",
                            defaultValue: "All",
                        },
                        {
                            name: "type",
                            defaultValue: "All",
                        },
                        {
                            name: "zone",
                            defaultValue: "All",
                        },
                        {
                            name: "country",
                            defaultValue: "All",
                        },
                        {
                            name: "insights_title",
                            defaultValue: "All",
                        },
                    ],
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=insights.view.js.map