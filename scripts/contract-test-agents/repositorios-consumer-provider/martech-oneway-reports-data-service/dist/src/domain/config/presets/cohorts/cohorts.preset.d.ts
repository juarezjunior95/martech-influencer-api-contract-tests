import { PresetConfig } from "@domain/entities/preset.entity";
declare const cohortsPreset: {
    cohorts: Record<string, never>;
};
declare const config: PresetConfig<typeof cohortsPreset>;
export default config;
