import type { ShowGlobalDataKpi } from "@domain/config/presets/show-global-data/show-global-data.types";
export interface CountryFilterItem {
    type: "country";
    scope?: string[];
    zoneScope?: string[];
    excludeGlobal?: boolean;
    hideGlobalForKpi?: ShowGlobalDataKpi;
    page?: string;
}
export interface CountryEntry {
    value: string;
    label: string;
    zone: string;
    quick_filter_label: string;
    image_url: string;
}
export interface CountryDefault {
    value: string;
    label: string;
    quick_filter_label: string;
}
export type CountryValuesByZone = Record<string, CountryEntry[]>;
export interface CountryPresetValue {
    values: CountryValuesByZone;
    default: CountryDefault;
    enabled: boolean;
}
export declare function isCountryFilterItem(value: unknown): value is CountryFilterItem;
