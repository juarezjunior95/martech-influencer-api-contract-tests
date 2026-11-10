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
        zones: {},
        country: {},
        ...(0, time_frame_builder_1.buildTimeFrameFilters)(),
    },
};
exports.default = config;
//# sourceMappingURL=growth-league.preset.js.map