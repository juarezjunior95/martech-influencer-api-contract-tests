import {
  FixedPresetFilter,
  PresetRefConfig,
} from "@domain/entities/preset.entity";
import {
  ABI_GLOBAL_ID,
  countriesRegistry,
} from "@domain/registries/countries.registry";

/**
 * Builder for the `zone` + `country` preset duo.
 *
 * Authors declare a single page-level list of country ids; the helper
 * derives the matching zone scope and emits the two `PresetRefConfig`
 * blocks (`zone` + `country`) so Data-Service handlers see a perfectly
 * consistent pair:
 *
 *   - `zone.scope`         = unique zones of the listed countries.
 *   - `zone.country_scope` = the listed countries (mirrors `country.scope`
 *     so `zone.default` aligns with `country.default.zone`).
 *   - `country.scope`      = the listed countries.
 *   - `country.zone_scope` = same as `zone.scope` (mirrors the
 *     cross-filter so the Data-Service enforces it authoritatively).
 *
 * `ABI` semantics:
 *   - `ABI` in the country list adds the synthetic "Global" row AND
 *     pulls the `ABI` zone into the zone scope. It is NOT a wildcard:
 *     zones for other countries listed are still required.
 *   - To get every zone (true wildcard), pass an empty list (or omit
 *     the argument) — the helper then emits no scope filters and
 *     Data-Service falls back to the user's accessible set.
 *
 * Runtime behavior (delegated to Data-Service):
 *   - A country the user can't reach is silently dropped from
 *     `country.values.<zone>` (and the Global bucket).
 *   - A zone whose every listed country was dropped disappears from
 *     `country.values` entirely; `zone.values` keeps it iff the user
 *     can otherwise reach it (regular access rules apply).
 *
 * Country/zone ids are validated against {@link countriesRegistry} at
 * runtime (module-load time): unknown ids throw
 * {@link UnknownCountryError}. Authors get a clear failure instead of
 * silently producing an empty scope.
 */

export interface ZoneCountryScope {
  /**
   * ISO3 country ids included in the page scope. Zones are derived
   * from this list. `ABI` is the synthetic Global row (it pulls the
   * `ABI` zone in but does NOT act as a country wildcard). Pass an
   * empty list (or omit) to mean "no scope restriction" — every
   * country the user can reach passes.
   */
  countries?: readonly string[];
}

/**
 * Build the `zone` and `country` `PresetRefConfig` blocks for an
 * object-form `PresetConfig.preset`. The zone scope is derived from
 * the country list; no separate zone argument is accepted so the two
 * scopes can never drift.
 */
export function buildZoneCountryFilters(
  scope: ZoneCountryScope,
  page?: string,
): {
  zones: PresetRefConfig;
  country: PresetRefConfig;
} {
  const countryScope = uniq(scope.countries ?? []);
  assertKnownCountries(countryScope);
  const zoneScope = deriveZoneScope(countryScope);

  const zoneFilters: FixedPresetFilter[] = [];
  if (zoneScope.length > 0) {
    zoneFilters.push(filter("scope", zoneScope));
  }
  if (countryScope.length > 0) {
    zoneFilters.push(filter("country_scope", countryScope));
  }
  if (page) {
    zoneFilters.push(filter("page", [page]));
  }
  const zones: PresetRefConfig = { filters: zoneFilters };

  const countryFilters: FixedPresetFilter[] = [];
  if (countryScope.length > 0) {
    countryFilters.push(filter("scope", countryScope));
  }
  if (zoneScope.length > 0) {
    countryFilters.push(filter("zone_scope", zoneScope));
  }
  if (page) {
    countryFilters.push(filter("page", [page]));
  }
  const country: PresetRefConfig = { filters: countryFilters };

  return { zones, country };
}

export class UnknownCountryError extends Error {
  constructor(unknown: string[]) {
    super(
      `Unknown country id(s) in scope: [${unknown.join(", ")}]. ` +
        `Expected ISO3 ids registered in countriesRegistry (or "${ABI_GLOBAL_ID}").`,
    );
    this.name = "UnknownCountryError";
  }
}

function deriveZoneScope(countries: readonly string[]): string[] {
  const zones = new Set<string>();
  for (const id of countries) {
    if (id === ABI_GLOBAL_ID) {
      zones.add(ABI_GLOBAL_ID);
      continue;
    }
    zones.add(countriesRegistry[id].zone);
  }
  return [...zones];
}

function assertKnownCountries(countries: readonly string[]): void {
  const unknown = countries.filter(
    (id) => id !== ABI_GLOBAL_ID && !countriesRegistry[id],
  );
  if (unknown.length > 0) {
    throw new UnknownCountryError(unknown);
  }
}

function uniq<T>(list: readonly T[]): T[] {
  return [...new Set(list)];
}

function filter(name: string, list: readonly string[]): FixedPresetFilter {
  return { name, value: list.join(",") };
}
