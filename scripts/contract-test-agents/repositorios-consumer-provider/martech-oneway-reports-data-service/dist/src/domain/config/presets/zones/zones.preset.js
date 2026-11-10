"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zones_handler_1 = require("./zones.handler");
const zones = {
    type: "zones",
};
const zonesPreset = { zones };
const config = {
    version: "1.0.0",
    handler: zones_handler_1.zonesHandler,
    preset: zonesPreset,
};
exports.default = config;
//# sourceMappingURL=zones.preset.js.map