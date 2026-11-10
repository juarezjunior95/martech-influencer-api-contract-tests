export interface ValueCreationFilterRawRow {
    ABI_ZONE: string;
    RAW_GEOGRAPHY: string;
    COUNTRY_ISO_CODE_3: string;
    GROWTHLEVER: string;
}
export interface ValueCreationGrowthLeverOption {
    label: string;
    value: string;
    disabled: boolean;
}
export interface ValueCreationCountryEntry {
    value: string;
    label: string;
    quick_filter_label: string;
    zone: string;
    growth_levers: ValueCreationGrowthLeverOption[];
    image_url: string;
}
export interface ValueCreationZoneOption {
    full: string;
    label: string;
    value: string;
    image_url: string;
}
export interface ValueCreationPeriodOption {
    value: string;
    label: string;
    full: string;
}
export interface ValueCreationCountryDimension {
    default: ValueCreationCountryEntry | Record<string, never>;
    values: Record<string, ValueCreationCountryEntry[]>;
}
export interface ValueCreationZonesDimension {
    default: ValueCreationZoneOption | Record<string, never>;
    values: ValueCreationZoneOption[];
}
export interface ValueCreationPeriodsDimension {
    default: ValueCreationPeriodOption | Record<string, never>;
    values: ValueCreationPeriodOption[];
}
export interface ValueCreationFilterPresetValue {
    country: ValueCreationCountryDimension;
    zones: ValueCreationZonesDimension;
    periods: ValueCreationPeriodsDimension;
}
export declare const VALUE_CREATION_DATASET_ID = "value-creation";
export declare const VALUE_CREATION_FILTER_SP_NAME = "7_value_creation_home_filter";
