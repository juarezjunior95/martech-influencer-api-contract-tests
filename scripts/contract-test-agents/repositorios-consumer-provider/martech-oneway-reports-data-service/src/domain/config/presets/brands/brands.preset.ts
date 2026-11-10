import { PresetConfig } from "@domain/entities/preset.entity";
import { BrandFilterItem } from "@domain/config/presets/brands/brands.types";
import { brandsHandler } from "@domain/config/presets/brands/brands.handler";

const brands: BrandFilterItem = {
  type: "brand",
  source: "databricks",
  includeGlobal: true,
};

const brandsPreset = { brands };

const config: PresetConfig<typeof brandsPreset> = {
  version: "1.0.0",
  handler: brandsHandler,
  preset: brandsPreset,
};

export default config;
