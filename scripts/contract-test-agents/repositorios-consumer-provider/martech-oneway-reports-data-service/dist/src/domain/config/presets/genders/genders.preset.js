"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const demographics_filter_handler_1 = require("../cohorts/demographics-filter.handler");
const gendersPreset = {
    genders: {},
};
const config = {
    version: "1.0.0",
    handler: demographics_filter_handler_1.genderFilterHandler,
    preset: gendersPreset,
};
exports.default = config;
//# sourceMappingURL=genders.preset.js.map