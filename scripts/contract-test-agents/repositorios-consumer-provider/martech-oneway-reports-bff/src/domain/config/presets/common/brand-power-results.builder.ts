import { PresetRefConfig } from "@domain/entities/preset.entity";

/**
 * Data-Service preset ref name for the `global-brands` preset (must match
 * `GET /v1/presets/:ref` and the object-form key in `PresetConfig.preset`).
 */
export const GLOBAL_BRANDS_PRESET_REF = "global-brands" as const;

/**
 * Data-Service preset ref name for the `brand-power-book-scopes` preset (must match
 * `GET /v1/presets/:ref` and the object-form key in `PresetConfig.preset`).
 */
export const BRAND_POWER_BOOK_SCOPES_PRESET_REF =
  "brand-power-book-scopes" as const;

type BrandPowerResultsPresetRefs =
  | typeof GLOBAL_BRANDS_PRESET_REF
  | typeof BRAND_POWER_BOOK_SCOPES_PRESET_REF;

/**
 * Builder for the `global-brands` + `brand-power-book-scopes` preset pair used on
 * brand power results pages.
 *
 * Emits both `PresetRefConfig` entries with the same filter wiring so composite
 * presets spread one helper instead of two, analogous to {@link buildZoneCountryFilters}
 * returning both `zones` and `country`.
 */
export function buildBrandPowerResultsFilters(): Record<
  BrandPowerResultsPresetRefs,
  PresetRefConfig
> {
  return {
    [GLOBAL_BRANDS_PRESET_REF]: brandsScopeRefConfig(),
    [BRAND_POWER_BOOK_SCOPES_PRESET_REF]: bookScopesScopeRefConfig(),
  };
}

function brandsScopeRefConfig(): PresetRefConfig {
  return {
    filters: [{ name: "noDefault", value: "true" }],
    formatter: "presets/filter-name-normalization",
  };
}

function bookScopesScopeRefConfig(): PresetRefConfig {
  return {
    filters: [],
    formatter: "presets/filter-name-normalization",
  };
}
