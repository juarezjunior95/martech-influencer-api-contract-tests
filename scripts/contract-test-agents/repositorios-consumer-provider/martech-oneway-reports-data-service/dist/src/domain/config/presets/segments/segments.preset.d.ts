import { PresetConfig } from "@domain/entities/preset.entity";
import { SegmentsPresetConfig } from "@domain/config/presets/segments/segments.handler";
declare const segmentsPreset: {
    segments: SegmentsPresetConfig;
};
declare const config: PresetConfig<typeof segmentsPreset>;
export default config;
