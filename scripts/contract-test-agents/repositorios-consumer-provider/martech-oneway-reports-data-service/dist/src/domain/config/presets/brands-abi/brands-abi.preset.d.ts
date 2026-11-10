import { PresetConfig } from "@domain/entities/preset.entity";
import { BrandAbiFilterItem } from "@domain/config/presets/brands-abi/brands-abi.types";
declare const brandAbiPreset: {
    "brands-abi": BrandAbiFilterItem;
};
declare const config: PresetConfig<typeof brandAbiPreset>;
export default config;
