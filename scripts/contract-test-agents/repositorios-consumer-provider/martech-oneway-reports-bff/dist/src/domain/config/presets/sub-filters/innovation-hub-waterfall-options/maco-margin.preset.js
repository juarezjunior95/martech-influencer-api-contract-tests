"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    version: "1.0.0",
    cache: {
        enabled: true,
        tags: ["filters"],
    },
    preset: {
        "innovation-hub-waterfall-options": {
            filters: [{ name: "kpi", value: "maco_margin" }],
        },
    },
};
exports.default = config;
//# sourceMappingURL=maco-margin.preset.js.map