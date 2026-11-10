import { PresetConfig } from "@domain/entities/preset.entity";
import { BrandFilterItem } from "@domain/config/presets/brands/brands.types";
declare const brandsPreset: {
    brands: BrandFilterItem;
};
declare const config: PresetConfig<typeof brandsPreset>;
export default config;
