import { PresetConfig } from "@domain/entities/preset.entity";
import { BrandAbiFilterItem } from "@domain/config/presets/brands-abi/brands-abi.types";
import { brandAbiHandler } from "@domain/config/presets/brands-abi/brands-abi.handler";

/**
 * `brand-abi` preset — exposes ABI brands grouped by country, matching
 * the legacy Drupal `brand_abi` filter.
 *
 * Endpoint: `GET /v1/presets/brand-abi`.
 */
const brandAbi: BrandAbiFilterItem = {
  type: "brands-abi",
  source: "databricks",
};

const brandAbiPreset = { "brands-abi": brandAbi };

const config: PresetConfig<typeof brandAbiPreset> = {
  version: "1.0.0",
  handler: brandAbiHandler,
  preset: brandAbiPreset,
};

export default config;
