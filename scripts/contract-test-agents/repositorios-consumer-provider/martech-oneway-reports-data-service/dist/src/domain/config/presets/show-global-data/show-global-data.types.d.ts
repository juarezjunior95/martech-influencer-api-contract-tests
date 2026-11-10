export declare const SHOW_GLOBAL_DATA_DATABRICKS_FUNCTION = "8_shared_global-parameter-filter";
export declare const SHOW_GLOBAL_DATA_SUBJECTS: readonly ["pos", "power"];
export type ShowGlobalDataKpi = (typeof SHOW_GLOBAL_DATA_SUBJECTS)[number];
export declare function showGlobalDatasetIdForSubject(subject: ShowGlobalDataKpi): string;
export type ShowGlobalDataPresetConfig = Record<string, never>;
export interface ShowGlobalDataKpiEntry {
    kpi: ShowGlobalDataKpi;
    hasGlobalData: boolean;
}
export interface ShowGlobalDataPresetValue {
    values: ShowGlobalDataKpiEntry[];
}
