import { PresetConfig } from "@domain/entities/preset.entity";
import { PeriodsPresetConfig } from "@domain/config/presets/periods/periods.handler";
declare const periodsPreset: {
    periods: PeriodsPresetConfig;
};
declare const config: PresetConfig<typeof periodsPreset>;
export default config;
