/**
 * Databricks result-query function for the show-global-data preset (MARTLH-12326).
 * Wired via `owr_result_query_sp` with a fixed `subject` per dataset.
 */
export const SHOW_GLOBAL_DATA_DATABRICKS_FUNCTION =
  "8_shared_global-parameter-filter";

/** Subjects fetched internally (frontend does not pass `subject`). Order = response order. */
export const SHOW_GLOBAL_DATA_SUBJECTS = ["pos", "power"] as const;

export type ShowGlobalDataKpi = (typeof SHOW_GLOBAL_DATA_SUBJECTS)[number];

export function showGlobalDatasetIdForSubject(
  subject: ShowGlobalDataKpi,
): string {
  return `show-global-data-${subject}`;
}

export type ShowGlobalDataPresetConfig = Record<string, never>;

export interface ShowGlobalDataKpiEntry {
  kpi: ShowGlobalDataKpi;
  hasGlobalData: boolean;
}

export interface ShowGlobalDataPresetValue {
  values: ShowGlobalDataKpiEntry[];
}
