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
                name: "country",
            },
            {
                name: "dt_ini",
            },
            {
                name: "dt_end",
            },
            {
                name: "kpi_name",
            },
        ],
    },
    components: [
        {
            id: "media_spend_ranking",
            formatter: "connections-and-creativity/resource-allocation-media/overview/media-spend-ranking",
            datasources: [
                {
                    name: "connections-and-creativity_resource-allocation-media_overview_unified-ranking",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=media-spend-ranking.view.js.map