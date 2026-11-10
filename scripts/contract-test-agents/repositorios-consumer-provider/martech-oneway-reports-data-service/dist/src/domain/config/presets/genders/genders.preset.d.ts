import { PresetConfig } from "@domain/entities/preset.entity";
declare const gendersPreset: {
    genders: Record<string, never>;
};
declare const config: PresetConfig<typeof gendersPreset>;
export default config;
