"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const years_handler_1 = require("./years.handler");
const yearsPreset = {
    years: {
        noDefault: false,
    },
};
const config = {
    version: "1.0.0",
    handler: years_handler_1.yearsHandler,
    preset: yearsPreset,
};
exports.default = config;
//# sourceMappingURL=years.preset.js.map