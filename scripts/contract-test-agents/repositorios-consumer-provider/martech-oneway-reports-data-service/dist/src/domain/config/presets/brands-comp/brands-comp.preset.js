"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const brands_comp_handler_1 = require("./brands-comp.handler");
const brandComp = {
    type: "brands-comp",
    source: "databricks",
};
const brandCompPreset = { "brands-comp": brandComp };
const config = {
    version: "1.0.0",
    handler: brands_comp_handler_1.brandCompHandler,
    preset: brandCompPreset,
};
exports.default = config;
//# sourceMappingURL=brands-comp.preset.js.map