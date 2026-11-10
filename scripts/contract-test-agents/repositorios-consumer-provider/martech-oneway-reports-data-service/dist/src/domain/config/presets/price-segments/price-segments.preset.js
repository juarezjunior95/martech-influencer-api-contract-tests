"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const price_segments_handler_1 = require("./price-segments.handler");
const priceSegmentsPreset = {
    "price-segments": {},
};
const config = {
    version: "1.0.0",
    handler: price_segments_handler_1.priceSegmentsHandler,
    preset: priceSegmentsPreset,
};
exports.default = config;
//# sourceMappingURL=price-segments.preset.js.map