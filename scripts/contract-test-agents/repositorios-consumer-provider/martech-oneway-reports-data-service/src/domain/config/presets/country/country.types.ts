/**
 * Type definitions for the `country` preset.
 *
 * Shapes mirror the legacy Drupal `Countries` filter response so the
 * BFF can replace the Drupal plugin without reformatting on its side.
 */

import type { ShowGlobalDataKpi } from "@domain/config/presets/show-global-data/show-global-data.types";

/**
 * Author-facing config item declared inside `country.preset.ts`.
 *
 * Distinguished from the entity's built-in `CountryFilterItem` (which
 * uses an explicit `countries: string[]` reference) by the
 * `type: "country"` discriminator and the absence of a `countries`
 * array — `expandCountryItems` only matches items with
 * `Array.isArray(countries)`.
 */
export interface CountryFilterItem {
  type: "country";
  /**
   * Page-level country scope: an explicit list of ISO3 country ids
   * that constrains the available universe for this page/preset.
   *
   * Wired through the entity's generic override pipeline:
   *   `?country[scope]=BRA,ARG,USA` -> `scope: ["BRA","ARG","USA"]`.
   *
   * The JWT permission trim still runs after the scope filter, so the
   * final universe is `scope ∩ countriesOf(zoneScope) ∩
   * user.countryAccess`.
   */
  scope?: string[];
  /**
   * Page-level zone scope mirror: when the same page also exposes a
   * `zone` preset with a `scope`, BFF callers replicate that list here
   * so the handler can enforce the cross-filter
   * (`country.scope ∩ countriesOf(zone.scope)`) authoritatively, even
   * when the request hits this endpoint directly.
   *
   * Wired through the entity's generic override pipeline:
   *   `?country[zone_scope]=AFR,SAZ` -> `zoneScope: ["AFR","SAZ"]`.
   *
   * Special id `ABI` acts as a wildcard (no zone restriction). When
   * omitted or containing `ABI`, no zone-based filtering is applied.
   */
  zoneScope?: string[];
  /**
   * Page-level toggle to drop the synthetic `ABI` (Global) bucket
   * from the response, regardless of whether the caller has global
   * access or `ABI` would otherwise be in scope. The `default` falls
   * back to the user's home country (when reachable) or the first
   * available country in the first available regional zone.
   *
   * Wired through the entity's generic override pipeline (booleans
   * arrive as strings on the query string and are coerced):
   *   `?country[exclude_global]=true` -> `excludeGlobal: true`.
   */
  excludeGlobal?: boolean;

  /**
   * When set, KPI views may hide the synthetic Global (`ABI`) row for
   * the given surface (`pos` vs `power`), independent of list filters.
   *
   * Wired through the entity's generic override pipeline:
   *   `?country[hide_global_for_kpi]=pos` -> `hideGlobalForKpi: "pos"`.
   */
  hideGlobalForKpi?: ShowGlobalDataKpi;

  /**
   * Page-level page name.
   *
   * Used to determine if the page allows all options.
   */
  page?: string;
}

/**
 * Single country row emitted under each zone bucket of `values`.
 *
 * `value` is the canonical ISO3 country id (synthetic `"ABI"` for the
 * global row); `zone` is the country's home zone (`"ABI"` only for
 * the synthetic Global row).
 */
export interface CountryEntry {
  value: string;
  label: string;
  zone: string;
  quick_filter_label: string;
  image_url: string;
}

/**
 * Default selection emitted alongside `values` and `enabled`.
 *
 * Sourced from the `country_group` static config (legacy Drupal admin
 * `Countries` plugin defaults). `full` is kept for shape parity with
 * `years.default` and is empty by default.
 */
export interface CountryDefault {
  value: string;
  label: string;
  quick_filter_label: string;
}

/**
 * Map of zone code -> ordered list of countries belonging to that
 * zone. The synthetic `ABI` bucket additionally includes the
 * Global row at the head, followed by every country (zone-tagged).
 */
export type CountryValuesByZone = Record<string, CountryEntry[]>;

/**
 * Final preset payload returned by the handler. Replaces the legacy
 * Drupal `Countries` filter response one-for-one.
 */
export interface CountryPresetValue {
  values: CountryValuesByZone;
  default: CountryDefault;
  enabled: boolean;
}

export function isCountryFilterItem(
  value: unknown,
): value is CountryFilterItem {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as CountryFilterItem).type === "country"
  );
}
