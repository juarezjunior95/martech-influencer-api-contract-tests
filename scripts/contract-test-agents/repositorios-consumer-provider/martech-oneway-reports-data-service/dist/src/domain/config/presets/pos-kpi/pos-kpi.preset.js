"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pos_kpi_handler_1 = require("./pos-kpi.handler");
const posKpiPreset = {
    "pos-kpi": {},
};
const config = {
    version: "1.0.0",
    handler: pos_kpi_handler_1.posKpiHandler,
    preset: posKpiPreset,
};
exports.default = config;
//# sourceMappingURL=pos-kpi.preset.js.map