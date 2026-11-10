import { PresetConfig } from "@domain/entities/preset.entity";
import {
  globalBrandsHandler,
  GlobalBrandsPresetConfig,
} from "@domain/config/presets/global-brands/global-brands.handler";

/**
 * `global-brands` preset — exposes Oneway Reports global brand options
 * in two groups (ABI brands + Competitor), matching Drupal
 * `GlobalBrand::getAllAsTuple` / `GlobalBrands` filter.
 *
 * Endpoint: `GET /v1/presets/global-brands`.
 *
 * Response key is `global-brands` (snake_case) for parity with the
 * Drupal filter id `global-brands`. Overrides:
 *
 *   - `?global-brands[noDefault]=true` — collapse `default` to empty strings.
 */
const globalBrandsPreset: { "global-brands": GlobalBrandsPresetConfig } = {
  "global-brands": {},
};

const config: PresetConfig<typeof globalBrandsPreset> = {
  version: "1.0.0",
  handler: globalBrandsHandler,
  preset: globalBrandsPreset,
};

export default config;
