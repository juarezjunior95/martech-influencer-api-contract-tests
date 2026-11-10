/**
 * Legacy Drupal `ValueLabelTupleDto` row for the `kpis` filter
 * (`Kpi.php` / `Kpis.php`), plus an empty `full` for parity with
 * other tuple-based presets (`segments`, `distributions`).
 */
export interface KpiTuple {
  value: string;
  label: string;
  full: string;
  /** When true, the option is shown but must not be selected (e.g. Innovation Hub). */
  isDisabled?: boolean;
}

export interface KpisPresetValue {
  enabled: boolean;
  default: KpiTuple | Record<string, never>;
  values: KpiTuple[];
}

/**
 * Author-facing config for the `kpis` preset.
 *
 * Mirrors Drupal `Kpis` filter `kpi_groups` (comma-separated list of
 * group keys). Each group contributes its KPI rows in definition
 * order; groups are concatenated in request order (same as
 * `array_merge` in PHP).
 *
 * Query overrides: `?kpis[kpi_groups]=performance_tool,innovation,innovation_hub`
 * (CSV) or a BFF-fixed `kpiGroups: string[]`.
 */
export interface KpisPresetConfig {
  kpiGroups: string[];
}
