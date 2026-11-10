import { PresetConfig } from "@domain/entities/preset.entity";
import { countryHandler } from "@domain/config/presets/country/country.handler";
import { CountryFilterItem } from "@domain/config/presets/country/country.types";

/**
 * `country` preset — replaces the legacy Drupal `Countries` filter.
 *
 * Endpoint: `GET /v1/presets/country`.
 *
 * The handler builds a zone-keyed payload (`values.ABI` + one bucket
 * per zone) entirely from the central country registry; no Databricks
 * dataset is declared. Defaults come from the `country_group` static
 * config (Drupal admin parity).
 */
const country: CountryFilterItem = {
  type: "country",
};

const countryPreset = { country };

const config: PresetConfig<typeof countryPreset> = {
  version: "1.0.0",
  handler: countryHandler,
  preset: countryPreset,
};

export default config;
