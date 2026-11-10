"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const demographics_filter_handler_1 = require("../cohorts/demographics-filter.handler");
const ageGroupsPreset = {
    "age-groups": {},
};
const config = {
    version: "1.0.0",
    handler: demographics_filter_handler_1.ageGroupsFilterHandler,
    preset: ageGroupsPreset,
};
exports.default = config;
//# sourceMappingURL=age-groups.preset.js.map