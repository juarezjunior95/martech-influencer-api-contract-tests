"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const time_frame_builder_1 = require("../common/time-frame.builder");
const config = {
    version: "1.0.0",
    cache: {
        enabled: true,
        tags: ["filters"],
    },
    preset: {
        ...(0, time_frame_builder_1.buildTimeFrameFilters)(),
        "value-creation": {
            filters: [],
            formatter: "presets/filter-name-normalization",
        },
    },
};
exports.default = config;
//# sourceMappingURL=home.preset.js.map