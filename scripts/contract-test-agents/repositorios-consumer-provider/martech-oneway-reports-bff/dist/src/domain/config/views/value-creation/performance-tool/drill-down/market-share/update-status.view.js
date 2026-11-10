"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    version: "1.0.0",
    cache: {
        enabled: true,
        tags: ["default"],
    },
    filters: {
        default: [],
    },
    components: [
        {
            id: "update-status",
            formatter: "value-creation/performance-tool/drill-down/market-share/update-status",
            datasources: [
                {
                    name: "value-creation_performance-tool_drill-down_non-finance_market-share_update-status",
                },
            ],
        },
    ],
};
exports.default = config;
//# sourceMappingURL=update-status.view.js.map