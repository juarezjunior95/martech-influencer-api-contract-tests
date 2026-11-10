"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kpi_group_handler_1 = require("./kpi-group.handler");
const kpiGroup = {
    type: "kpi-group",
    source: "databricks",
};
const kpiGroupPreset = { kpiGroup };
const config = {
    version: "1.0.0",
    handler: kpi_group_handler_1.kpiGroupHandler,
    preset: kpiGroupPreset,
};
exports.default = config;
//# sourceMappingURL=kpi-group.preset.js.map