import { PresetConfig } from "@domain/entities/preset.entity";
import { ZonesFilterItem } from "@domain/config/presets/zones/zones.types";
declare const zonesPreset: {
    zones: ZonesFilterItem;
};
declare const config: PresetConfig<typeof zonesPreset>;
export default config;
