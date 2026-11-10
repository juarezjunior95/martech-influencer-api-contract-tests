import { PresetConfig } from "@domain/entities/preset.entity";
import type { KpisPresetConfig } from "@domain/config/presets/kpis/kpis.types";
declare const kpisPreset: {
    kpis: KpisPresetConfig;
};
declare const config: PresetConfig<typeof kpisPreset>;
export default config;
