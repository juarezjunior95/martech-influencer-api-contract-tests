"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    version: "1.0.0",
    cache: {
        enabled: true,
        tags: ["filters"],
    },
    preset: {
        "performance-tool-waterfall-options": {
            filters: [{ name: "kpi", value: "market_share" }],
        },
    },
};
exports.default = config;
//# sourceMappingURL=market-share.preset.js.map