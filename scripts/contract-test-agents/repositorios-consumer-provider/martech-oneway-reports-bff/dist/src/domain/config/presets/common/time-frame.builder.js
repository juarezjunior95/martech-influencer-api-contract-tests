"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TIME_FRAME_PRESET_REF = exports.TIME_FRAME_FORMATTER = void 0;
exports.buildTimeFrameFilters = buildTimeFrameFilters;
exports.TIME_FRAME_FORMATTER = "presets/filter-name-normalization";
exports.TIME_FRAME_PRESET_REF = "time-frame";
function buildTimeFrameFilters() {
    return {
        [exports.TIME_FRAME_PRESET_REF]: {
            filters: [],
            formatter: exports.TIME_FRAME_FORMATTER,
        },
    };
}
//# sourceMappingURL=time-frame.builder.js.map