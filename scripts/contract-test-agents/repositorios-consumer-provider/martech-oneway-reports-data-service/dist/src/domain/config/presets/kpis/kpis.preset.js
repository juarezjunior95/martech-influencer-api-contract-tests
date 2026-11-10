"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kpis_handler_1 = require("./kpis.handler");
const kpisPreset = {
    kpis: {
        kpiGroups: [],
    },
};
const config = {
    version: "1.0.0",
    handler: kpis_handler_1.kpisHandler,
    preset: kpisPreset,
};
exports.default = config;
//# sourceMappingURL=kpis.preset.js.map