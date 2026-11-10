import { PresetConfig } from "@domain/entities/preset.entity";
import { YearsPresetConfig } from "@domain/config/presets/years/years.handler";
declare const yearsPreset: {
    years: YearsPresetConfig;
};
declare const config: PresetConfig<typeof yearsPreset>;
export default config;
