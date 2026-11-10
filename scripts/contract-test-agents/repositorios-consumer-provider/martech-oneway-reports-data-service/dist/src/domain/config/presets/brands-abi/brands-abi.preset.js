"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const brands_abi_handler_1 = require("./brands-abi.handler");
const brandAbi = {
    type: "brands-abi",
    source: "databricks",
};
const brandAbiPreset = { "brands-abi": brandAbi };
const config = {
    version: "1.0.0",
    handler: brands_abi_handler_1.brandAbiHandler,
    preset: brandAbiPreset,
};
exports.default = config;
//# sourceMappingURL=brands-abi.preset.js.map