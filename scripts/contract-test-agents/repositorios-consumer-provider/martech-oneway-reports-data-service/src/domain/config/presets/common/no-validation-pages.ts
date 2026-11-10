/**
 * Pages that opt out of JWT-driven reachability and per-country trims.
 *
 * Listed pages expose every zone in the page `scope` / `zoneScope` and
 * every country inside those zones, regardless of the caller's
 * `policy.mode`. Global suppression (`excludeGlobal` /
 * `hideGlobalForKpi`) and default selection still honor the real
 * authenticated user — the user is never substituted with `undefined`.
 *
 * Centralized here so the two handlers cannot drift: adding or
 * removing a page is a single edit, and both presets pick it up
 * automatically.
 */
export const NO_VALIDATION_PAGES: readonly string[] = [
  "category_home",
  "category_category-health",
  "category_pos-results",
  "category_pos-results-export",
  "brand-power-results",
  "category_pos-tool-overview",
  "category_pos-tool-drilldown",
  "brand-power-results-export",
];

/**
 * Returns `true` when the given page name opts out of permission
 * filtering. Tolerates `undefined` / missing values (which is the
 * common case — most pages don't set `page` at all).
 */
export function pageAllowsAllOptions(page?: string): boolean {
  return NO_VALIDATION_PAGES.includes(page ?? "");
}
