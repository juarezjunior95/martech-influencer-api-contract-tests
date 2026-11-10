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
            {
                name: "kpi_name",
            },
        ],
    },
    components: [
        {
            id: "breakdown",
            formatter: "consumer/one-yp/performance/breakdown",
            datasources: [
                {
                    name: "consumer_one-yp_performance_breakdown",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=breakdown.view.js.map