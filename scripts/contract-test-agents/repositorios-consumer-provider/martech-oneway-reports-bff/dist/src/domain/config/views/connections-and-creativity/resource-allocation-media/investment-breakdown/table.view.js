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
                name: "dt_ini",
            },
            {
                name: "dt_end",
            },
            {
                name: "viewtype",
            },
        ],
    },
    components: [
        {
            id: "investment_breakdown",
            formatter: "connections-and-creativity/resource-allocation-media/investment-breakdown/table",
            datasources: [
                {
                    name: "connections-and-creativity_resource-allocation-media_investment-breakdown_media-full-year-kpis",
                },
                {
                    name: "connections-and-creativity_resource-allocation-media_investment-breakdown_volume-kpi",
                },
                {
                    name: "connections-and-creativity_resource-allocation-media_investment-breakdown_media-ytd-kpis",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=table.view.js.map