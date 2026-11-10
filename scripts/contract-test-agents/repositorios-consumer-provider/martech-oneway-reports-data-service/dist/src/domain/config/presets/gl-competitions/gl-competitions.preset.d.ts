import { PresetConfig } from "@domain/entities/preset.entity";
import type { GlCompetitionsPresetConfig } from "@domain/config/presets/gl-competitions/gl-competitions.types";
declare const glCompetitionsPreset: {
    "gl-competitions": GlCompetitionsPresetConfig;
};
declare const config: PresetConfig<typeof glCompetitionsPreset>;
export default config;
