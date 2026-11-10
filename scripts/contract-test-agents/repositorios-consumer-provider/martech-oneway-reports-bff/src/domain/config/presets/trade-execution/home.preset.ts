import { PresetConfig } from "@domain/entities/preset.entity";
import { buildZoneCountryFilters } from "@domain/config/presets/common/zone-country.builder";
import { BEES_DISTRIBUTION_COUNTRIES } from "../common/country-scopes";

/**
 * BFF preset for the Value Creation home page.
 *
 * Composes the Data-Service `zone` and `country` presets in parallel
 * from a single page-level country list. The helper:
 *
 *   - Validates country ids at authoring time (typos are a compile
 *     error).
 *   - Derives the zone scope from the listed countries so the two
 *     scopes can never drift.
 *   - Mirrors the derived zones into `country.zone_scope` so the
 *     Data-Service handler enforces the cross-filter authoritatively.
 *
 * `ABI` semantics:
 *   - `ABI` in the country list adds the synthetic Global row AND
 *     pulls the `ABI` zone into scope. It is NOT a wildcard.
 *   - To allow every zone/country, pass an empty list (or omit
 *     `countries`).
 */

const { zones, country } = buildZoneCountryFilters({
  countries: BEES_DISTRIBUTION_COUNTRIES,
});

const config: PresetConfig = {
  version: "1.0.0",
  cache: {
    enabled: true,
    tags: ["filters"],
  },
  preset: {
    zones,
    country,
    periods: {
      filters: [{ name: "scope", value: "YTD" }],
    },
  },
};

export default config;
