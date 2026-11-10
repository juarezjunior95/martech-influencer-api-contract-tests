"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    version: "1.0.0",
    cache: {
        enabled: true,
        tags: ["filters"],
    },
    preset: {
        kpis: {
            filters: [{ name: "kpi_groups", value: "performance_tool" }],
        },
        "performance-tool": {
            filters: [],
            formatter: "presets/filter-name-normalization",
        },
    },
};
exports.default = config;
//# sourceMappingURL=performance-tool.preset.js.map