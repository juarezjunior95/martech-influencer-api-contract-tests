import { PresetConfig } from "@domain/entities/preset.entity";
import { DistributionsPresetConfig } from "@domain/config/presets/distributions/distributions.handler";
declare const distributionsPreset: {
    distributions: DistributionsPresetConfig;
};
declare const config: PresetConfig<typeof distributionsPreset>;
export default config;
