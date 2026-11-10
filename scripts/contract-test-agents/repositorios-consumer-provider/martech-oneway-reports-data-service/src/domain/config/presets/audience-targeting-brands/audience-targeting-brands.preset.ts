import { PresetConfig } from "@domain/entities/preset.entity";
import { audienceTargetingBrandsHandler } from "@domain/config/presets/audience-targeting-brands/audience-targeting-brands.handler";

/**
 * `audience-targeting-brands` preset — country-keyed ABI brands with
 * competitor rows for audience targeting.
 *
 * Endpoint: `GET /v1/presets/audience-targeting-brands`.
 *
 * The handler materializes the payload from a static registry; no
 * Databricks dataset is declared.
 */
const audienceTargetingBrandsPreset: {
  "audience-targeting-brands": Record<string, never>;
} = {
  "audience-targeting-brands": {},
};

const config: PresetConfig<typeof audienceTargetingBrandsPreset> = {
  version: "1.0.0",
  handler: audienceTargetingBrandsHandler,
  preset: audienceTargetingBrandsPreset,
};

export default config;
