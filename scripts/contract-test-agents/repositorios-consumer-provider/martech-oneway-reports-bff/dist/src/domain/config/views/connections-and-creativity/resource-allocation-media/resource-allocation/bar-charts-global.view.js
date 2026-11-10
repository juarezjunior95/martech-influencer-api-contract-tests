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
                name: "viewtype",
            },
            {
                name: "kpi_name",
            },
            {
                name: "country",
            },
            {
                name: "dt_ini",
            },
            {
                name: "dt_end",
            },
        ],
    },
    components: [
        {
            id: "bar_charts_global",
            formatter: "connections-and-creativity/resource-allocation-media/resource-allocation/bar-charts-global",
            datasources: [
                {
                    name: "connections-and-creativity_resource-allocation-media_resource-allocation_bar-charts-global",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=bar-charts-global.view.js.map