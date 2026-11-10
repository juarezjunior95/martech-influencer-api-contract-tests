"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cohorts_handler_1 = require("./cohorts.handler");
const cohortsPreset = {
    cohorts: {},
};
const config = {
    version: "1.0.0",
    handler: cohorts_handler_1.cohortsHandler,
    preset: cohortsPreset,
};
exports.default = config;
//# sourceMappingURL=cohorts.preset.js.map