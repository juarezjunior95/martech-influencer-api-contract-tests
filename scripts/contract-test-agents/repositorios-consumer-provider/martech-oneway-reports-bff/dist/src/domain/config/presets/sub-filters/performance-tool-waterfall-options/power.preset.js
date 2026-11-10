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
            filters: [{ name: "kpi", value: "power" }],
        },
    },
};
exports.default = config;
//# sourceMappingURL=power.preset.js.map