import { PresetRefConfig } from "../../../entities/preset.entity";
export declare const TIME_FRAME_FORMATTER = "presets/filter-name-normalization";
export declare const TIME_FRAME_PRESET_REF: "time-frame";
export declare function buildTimeFrameFilters(): Record<typeof TIME_FRAME_PRESET_REF, PresetRefConfig>;
