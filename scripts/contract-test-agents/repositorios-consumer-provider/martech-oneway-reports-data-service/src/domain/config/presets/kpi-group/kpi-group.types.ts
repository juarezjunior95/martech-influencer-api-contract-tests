import { KpiGroupTimeFrameConfig } from "@domain/config/config-groups/kpi-group-time-frame.config";

export const KPI_GROUP_DATASET_ID = "kpi-group-time-frame";
export const KPI_GROUP_DATASET_QUERY = "presets/kpi-group/kpi-group";

/**
 * Marker filter item for the kpi-group preset.
 *
 * The handler ignores nested fields today (the query returns a flat
 * `{ kpi_name, time_frame }` table that maps 1:1 onto the response),
 * but the `type: "kpi-group"` discriminator keeps the door open for
 * country/zone scoping later — same pattern as `BrandFilterItem`.
 */
export interface KpiGroupFilterItem {
  type: "kpi-group";
  source: "databricks";
}

/**
 * Final emitted value for a kpi-group entry. Matches the legacy
 * `KpiGroupTimeFrameConfig` shape: per-KPI dates are legacy
 * `DD-MM-YYYY` strings, the `category_health_full_years_*` range is
 * numeric.
 */
export type KpiGroupPresetValue = string | number;

/**
 * Subset of `KpiGroupTimeFrameConfig` keys whose value must be coerced
 * back to a number to match the legacy shape. Adding a new numeric
 * field to `KpiGroupTimeFrameConfig` means listing it here — TypeScript
 * will not enforce that, so keep these in sync.
 */
export const KPI_GROUP_NUMERIC_KEYS = new Set<keyof KpiGroupTimeFrameConfig>([
  "category_health_full_years_start",
  "category_health_full_years_end",
]);

export type KpiGroupResponseMap = Partial<KpiGroupTimeFrameConfig> &
  Record<string, KpiGroupPresetValue>;

export function isKpiGroupFilterItem(
  value: unknown,
): value is KpiGroupFilterItem {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as KpiGroupFilterItem).type === "kpi-group"
  );
}
