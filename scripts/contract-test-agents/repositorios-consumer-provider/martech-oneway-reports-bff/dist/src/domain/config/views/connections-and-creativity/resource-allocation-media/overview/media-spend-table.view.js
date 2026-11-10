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
        ],
    },
    components: [
        {
            id: "media_spend",
            formatter: "connections-and-creativity/resource-allocation-media/overview/media-spend-table",
            datasources: [
                {
                    name: "connections-and-creativity_resource-allocation-media_overview_media-spend-table",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=media-spend-table.view.js.map