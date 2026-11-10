import { PresetConfig } from "@domain/entities/preset.entity";
import type { ShowGlobalDataPresetConfig } from "@domain/config/presets/show-global-data/show-global-data.types";
declare const showGlobalDataPreset: {
    show_global_data: ShowGlobalDataPresetConfig;
};
declare const config: PresetConfig<typeof showGlobalDataPreset>;
export default config;
