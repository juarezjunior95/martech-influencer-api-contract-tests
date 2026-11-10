import { PresetConfig } from "@domain/entities/preset.entity";
import { CountryFilterItem } from "@domain/config/presets/country/country.types";
declare const posToolDrilldownPreset: {
    "pos-tool-drilldown": {};
    "category_pos-tool-drilldown": CountryFilterItem;
};
declare const config: PresetConfig<typeof posToolDrilldownPreset>;
export default config;
