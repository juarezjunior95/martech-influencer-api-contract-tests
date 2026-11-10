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
                name: "brand",
            },
            {
                name: "country",
            },
            {
                name: "competitor",
            },
        ],
    },
    components: [
        {
            id: "core-audience-performance",
            formatter: "consumer/one-yp/performance/core-audience-performance",
            datasources: [
                {
                    name: "consumer_one-yp_performance_core-audience-performance",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=audience-performance.view.js.map