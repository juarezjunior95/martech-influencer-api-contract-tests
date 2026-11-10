"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const segments_handler_1 = require("./segments.handler");
const segmentsPreset = {
    segments: {},
};
const config = {
    version: "1.0.0",
    handler: segments_handler_1.segmentsHandler,
    preset: segmentsPreset,
};
exports.default = config;
//# sourceMappingURL=segments.preset.js.map