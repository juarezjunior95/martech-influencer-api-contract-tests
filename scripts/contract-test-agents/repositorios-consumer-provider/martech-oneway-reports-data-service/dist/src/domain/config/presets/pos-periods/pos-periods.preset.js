"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pos_periods_handler_1 = require("./pos-periods.handler");
const posPeriodsPreset = {
    "pos-periods": {},
};
const config = {
    version: "1.0.0",
    handler: pos_periods_handler_1.posPeriodsHandler,
    preset: posPeriodsPreset,
};
exports.default = config;
//# sourceMappingURL=pos-periods.preset.js.map