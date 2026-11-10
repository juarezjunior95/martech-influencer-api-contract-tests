"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const demographics_filter_handler_1 = require("../cohorts/demographics-filter.handler");
const incomeGroupsPreset = {
    "income-groups": {},
};
const config = {
    version: "1.0.0",
    handler: demographics_filter_handler_1.incomeGroupsFilterHandler,
    preset: incomeGroupsPreset,
};
exports.default = config;
//# sourceMappingURL=income-groups.preset.js.map