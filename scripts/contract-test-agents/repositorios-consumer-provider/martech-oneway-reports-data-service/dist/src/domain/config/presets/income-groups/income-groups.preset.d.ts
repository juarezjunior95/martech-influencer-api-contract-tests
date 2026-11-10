import { PresetConfig } from "@domain/entities/preset.entity";
declare const incomeGroupsPreset: {
    "income-groups": Record<string, never>;
};
declare const config: PresetConfig<typeof incomeGroupsPreset>;
export default config;
