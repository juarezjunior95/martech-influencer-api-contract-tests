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
                name: "country",
            },
            {
                name: "brand",
            },
            {
                name: "period",
            },
        ],
        filterGroup: [
            {
                name: "country",
            },
            {
                name: "brand",
            },
            {
                name: "dt_end",
            },
            {
                name: "region",
            },
        ],
        filterGroup2: [
            {
                name: "country",
            },
            {
                name: "dt_start",
            },
            {
                name: "dt_end",
            },
        ],
    },
    components: [
        {
            id: "exampleSales",
            formatter: "example/exampleSales",
            datasources: [
                {
                    name: "sales",
                    filterSet: "filterGroup",
                    filters: [
                        {
                            name: "segment",
                            defaultValue: "all",
                        },
                    ],
                },
            ],
        },
        {
            id: "exampleRevenue",
            formatter: "example/exampleRevenue",
            datasources: [
                {
                    name: "revenue",
                },
            ],
        },
        {
            id: "exampleSalesPerformance",
            formatter: "example/exampleSalesPerformance",
            datasources: [
                {
                    name: "sales",
                    filterSet: "filterGroup",
                },
            ],
        },
        {
            id: "exampleDeepDiveSales",
            formatter: "example/exampleDeepDiveSales",
            datasources: [
                {
                    name: "sales",
                    filterSet: "filterGroup2",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=example.view.js.map