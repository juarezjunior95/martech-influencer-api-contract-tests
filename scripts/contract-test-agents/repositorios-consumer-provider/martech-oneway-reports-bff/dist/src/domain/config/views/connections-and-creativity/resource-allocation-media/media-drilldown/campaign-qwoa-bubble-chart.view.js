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
            id: "campaign_qwoa",
            formatter: "connections-and-creativity/resource-allocation-media/media-drilldown/campaign-qwoa-bubble-chart",
            datasources: [
                {
                    name: "connections-and-creativity_resource-allocation-media_media-drilldown_campaign-qwoa-bubble-chart",
                },
                {
                    name: "connections-and-creativity_resource-allocation-media_media-drilldown_campaigns-under-12-qwoa-campaign-qwoa-per-brand",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=campaign-qwoa-bubble-chart.view.js.map