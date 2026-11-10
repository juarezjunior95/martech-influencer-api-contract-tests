import { PresetConfig } from "@domain/entities/preset.entity";
import {
  brandPowerBookScopesHandler,
  BrandPowerBookScopesPresetConfig,
} from "@domain/config/presets/brand-power-book-scopes/brand-power-book-scopes.handler";

/**
 * `brand-power-book-scopes` preset — exposes the Brand Power Book page
 * scope options (Portfolio, Global Brands, Segment), matching Drupal
 * `BrandPowerBookScope::getAllAsTuple` and the
 * `brand_power_book_scopes` filter.
 *
 * Endpoint: `GET /v1/presets/brand-power-book-scopes`.
 *
 * Default selection is empty value/label strings, matching Drupal
 * `BrandPowerBookScopes::getDefaultOption` (no implicit selection).
 * The Drupal filter defines no extra parameters; the preset config
 * object is `{}` for forward compatibility.
 */
const brandPowerBookScopesPreset: {
  "brand-power-book-scopes": BrandPowerBookScopesPresetConfig;
} = {
  "brand-power-book-scopes": {},
};

const config: PresetConfig<typeof brandPowerBookScopesPreset> = {
  version: "1.0.0",
  handler: brandPowerBookScopesHandler,
  preset: brandPowerBookScopesPreset,
};

export default config;
