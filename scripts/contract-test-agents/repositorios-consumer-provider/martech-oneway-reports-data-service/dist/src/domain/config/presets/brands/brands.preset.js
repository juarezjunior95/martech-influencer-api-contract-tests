"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const brands_handler_1 = require("./brands.handler");
const brands = {
    type: "brand",
    source: "databricks",
    includeGlobal: true,
};
const brandsPreset = { brands };
const config = {
    version: "1.0.0",
    handler: brands_handler_1.brandsHandler,
    preset: brandsPreset,
};
exports.default = config;
//# sourceMappingURL=brands.preset.js.map