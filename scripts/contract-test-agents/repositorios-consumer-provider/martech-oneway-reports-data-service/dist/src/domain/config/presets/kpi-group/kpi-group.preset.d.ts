import { PresetConfig } from "@domain/entities/preset.entity";
import { KpiGroupFilterItem } from "@domain/config/presets/kpi-group/kpi-group.types";
declare const kpiGroupPreset: {
    kpiGroup: KpiGroupFilterItem;
};
declare const config: PresetConfig<typeof kpiGroupPreset>;
export default config;
