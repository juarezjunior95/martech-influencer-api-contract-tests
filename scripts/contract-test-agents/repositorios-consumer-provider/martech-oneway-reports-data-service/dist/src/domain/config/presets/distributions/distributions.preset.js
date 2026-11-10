"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const distributions_handler_1 = require("./distributions.handler");
const distributionsPreset = {
    distributions: {},
};
const config = {
    version: "1.0.0",
    handler: distributions_handler_1.distributionsHandler,
    preset: distributionsPreset,
};
exports.default = config;
//# sourceMappingURL=distributions.preset.js.map