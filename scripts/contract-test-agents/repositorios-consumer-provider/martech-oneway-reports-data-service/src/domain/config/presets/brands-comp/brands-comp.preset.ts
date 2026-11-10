import { PresetConfig } from "@domain/entities/preset.entity";
import { BrandCompFilterItem } from "@domain/config/presets/brands-comp/brands-comp.types";
import { brandCompHandler } from "@domain/config/presets/brands-comp/brands-comp.handler";

/**
 * `brand-comp` preset — exposes competitor brands grouped by country,
 * matching the legacy Drupal `brand_comp` filter.
 *
 * Endpoint: `GET /v1/presets/brand-comp`.
 */
const brandComp: BrandCompFilterItem = {
  type: "brands-comp",
  source: "databricks",
};

const brandCompPreset = { "brands-comp": brandComp };

const config: PresetConfig<typeof brandCompPreset> = {
  version: "1.0.0",
  handler: brandCompHandler,
  preset: brandCompPreset,
};

export default config;
