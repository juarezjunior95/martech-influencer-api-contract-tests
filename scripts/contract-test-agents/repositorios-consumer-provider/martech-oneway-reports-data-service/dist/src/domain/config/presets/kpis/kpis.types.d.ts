export interface KpiTuple {
    value: string;
    label: string;
    full: string;
    isDisabled?: boolean;
}
export interface KpisPresetValue {
    enabled: boolean;
    default: KpiTuple | Record<string, never>;
    values: KpiTuple[];
}
export interface KpisPresetConfig {
    kpiGroups: string[];
}
