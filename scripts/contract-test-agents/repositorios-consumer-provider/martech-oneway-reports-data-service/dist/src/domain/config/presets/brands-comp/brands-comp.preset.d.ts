import { PresetConfig } from "@domain/entities/preset.entity";
import { BrandCompFilterItem } from "@domain/config/presets/brands-comp/brands-comp.types";
declare const brandCompPreset: {
    "brands-comp": BrandCompFilterItem;
};
declare const config: PresetConfig<typeof brandCompPreset>;
export default config;
