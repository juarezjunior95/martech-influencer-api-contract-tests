import type { ShowGlobalDataKpi } from "@domain/config/presets/show-global-data/show-global-data.types";
export interface ZonesFilterItem {
    type: "zones";
    scope?: string[];
    countryScope?: string[];
    excludeGlobal?: boolean;
    hideGlobalForKpi?: ShowGlobalDataKpi;
    page?: string;
}
export interface ZonesEntry {
    value: string;
    label: string;
    quick_filter_label: string;
    image_url: string;
}
export interface ZonesPresetValue {
    values: ZonesEntry[];
    default: ZonesEntry;
    enabled: boolean;
}
export declare function isZonesFilterItem(value: unknown): value is ZonesFilterItem;
