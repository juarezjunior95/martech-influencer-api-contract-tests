import { KpiGroupTimeFrameConfig } from "@domain/config/config-groups/kpi-group-time-frame.config";
export declare const KPI_GROUP_DATASET_ID = "kpi-group-time-frame";
export declare const KPI_GROUP_DATASET_QUERY = "presets/kpi-group/kpi-group";
export interface KpiGroupFilterItem {
    type: "kpi-group";
    source: "databricks";
}
export type KpiGroupPresetValue = string | number;
export declare const KPI_GROUP_NUMERIC_KEYS: Set<keyof KpiGroupTimeFrameConfig>;
export type KpiGroupResponseMap = Partial<KpiGroupTimeFrameConfig> & Record<string, KpiGroupPresetValue>;
export declare function isKpiGroupFilterItem(value: unknown): value is KpiGroupFilterItem;
