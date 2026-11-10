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
            filters: [{ name: "kpiGroups", value: "resource_allocation_ranking" }],
        },
    },
};
exports.default = config;
//# sourceMappingURL=resource-allocation-ranking.preset.js.map