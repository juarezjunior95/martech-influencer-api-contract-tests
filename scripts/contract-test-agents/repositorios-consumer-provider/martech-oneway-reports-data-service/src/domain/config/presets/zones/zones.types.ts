/**
 * Type definitions for the `zone` preset.
 *
 * Mirrors the shape of the `country` preset response so consumers
 * can render zones with the same filter machinery they already use
 * for countries. A zone is a coarse-grained grouping of countries
 * (`AFR`, `APAC`, `EUR`, `MAZ`, `NAZ`, `SAZ`, plus the synthetic
 * `ABI` Global bucket) sourced from the central `zonesRegistry`.
 */

import type { ShowGlobalDataKpi } from "@domain/config/presets/show-global-data/show-global-data.types";

/**
 * Author-facing config item declared inside `zones.preset.ts`.
 *
 * The `type: "zones"` discriminator keeps this shape distinguishable
 * from `CountryFilterItem` so handlers can co-exist in the same
 * preset definition without ambiguity.
 */
export interface ZonesFilterItem {
  type: "zones";
  /**
   * Page-level zone scope: an explicit list of zone ids that
   * constrains the available universe for this page/preset.
   *
   * Wired through the entity's generic override pipeline:
   *   `?zones[scope]=AFR,EUR` -> `scope: ["AFR","EUR"]`.
   *
   * Special id `ABI` controls the synthetic Global row:
   *   - present in `scope` (or scope omitted) -> Global row emitted.
   *   - absent from a non-empty `scope` -> Global row hidden.
   * The `country` preset honors the same convention via its
   * `zone_scope` mirror, keeping both responses in sync.
   */
  scope?: string[];
  /**
   * Page-level country scope mirror: when the same page also exposes
   * a `country` preset with a `scope`, BFF callers replicate that
   * list here so the handler can compute the `default` against the
   * same available-country universe — keeping `zone.default` aligned
   * with `country.default.zone`.
   *
   * Wired through the entity's generic override pipeline:
   *   `?zones[country_scope]=BRA,ARG` -> `countryScope: ["BRA","ARG"]`.
   *
   * Has no effect on `values` (zone reachability is decided purely by
   * `scope` + user policy).
   */
  countryScope?: string[];
  /**
   * Page-level toggle to drop the synthetic `ABI` (Global) row from
   * the response, regardless of whether the caller has global access
   * or `ABI` would otherwise be in scope. The `default` falls back to
   * the user's home country (when reachable) or the first available
   * regional zone.
   *
   * Wired through the entity's generic override pipeline (booleans
   * arrive as strings on the query string and are coerced):
   *   `?zones[exclude_global]=true` -> `excludeGlobal: true`.
   */
  excludeGlobal?: boolean;

  /**
   * When set, KPI views may hide the synthetic Global (`ABI`) row for
   * the given surface (`pos` vs `power`), independent of list filters.
   *
   * Wired through the entity's generic override pipeline:
   *   `?zones[hide_global_for_kpi]=power` -> `hideGlobalForKpi: "power"`.
   */
  hideGlobalForKpi?: ShowGlobalDataKpi;

  /**
   * Page-level page name.
   *
   * Used to determine if the page allows all options (i.e. bypasses
   * the JWT-driven zone/country trim entirely). Mirrors the same
   * field on `CountryFilterItem` so the `zone` and `country` presets
   * stay consistent for pages that opt out of permission filtering.
   */
  page?: string;
}

/**
 * Single zone row emitted in `values` (and in `default`).
 *
 * `value` is the canonical zone id (`AFR`, `APAC`, `EUR`, `MAZ`,
 * `NAZ`, `SAZ`, or `ABI` for the synthetic Global row).
 */
export interface ZonesEntry {
  value: string;
  label: string;
  quick_filter_label: string;
  image_url: string;
}

/**
 * Final preset payload returned by the handler.
 */
export interface ZonesPresetValue {
  values: ZonesEntry[];
  default: ZonesEntry;
  enabled: boolean;
}

export function isZonesFilterItem(value: unknown): value is ZonesFilterItem {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as ZonesFilterItem).type === "zones"
  );
}
