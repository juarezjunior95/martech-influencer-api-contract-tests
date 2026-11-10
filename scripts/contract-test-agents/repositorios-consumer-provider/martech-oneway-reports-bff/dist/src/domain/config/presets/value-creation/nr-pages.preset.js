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
        zones: {
            filters: [{ name: "excludeGlobal", value: true }],
        },
        country: {
            filters: [{ name: "excludeGlobal", value: true }],
        },
        ...(0, time_frame_builder_1.buildTimeFrameFilters)(),
    },
};
exports.default = config;
//# sourceMappingURL=nr-pages.preset.js.map