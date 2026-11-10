import { PresetConfig } from "@domain/entities/preset.entity";
import { GlobalBrandsPresetConfig } from "@domain/config/presets/global-brands/global-brands.handler";
declare const globalBrandsPreset: {
    "global-brands": GlobalBrandsPresetConfig;
};
declare const config: PresetConfig<typeof globalBrandsPreset>;
export default config;
