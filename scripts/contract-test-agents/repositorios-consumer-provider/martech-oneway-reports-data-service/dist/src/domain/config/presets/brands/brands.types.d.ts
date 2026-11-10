export declare const BRAND_DATASET_ID = "brand-subbrands";
export declare const BRAND_DATASET_QUERY = "presets/brand/brand-subbrands";
export interface BrandFilterItem {
    type: "brand";
    label?: string;
    shortLabel?: string;
    source: "databricks";
    includeGlobal?: boolean;
    includeAllBrands?: boolean;
    includeSubBrands?: boolean;
    includeAllSubBrands?: boolean;
    flatten?: boolean;
    fieldLabel?: string;
    subFieldLabel?: string;
    countries?: string[];
}
export interface BrandValueLabel {
    value: string;
    label: string;
    image_url: string;
    image_variants: Record<string, string>;
}
export interface BrandEntry {
    value: string;
    label: string;
    image_url: string;
    image_variants: Record<string, string>;
    sub_brands?: BrandValueLabel[];
    default?: BrandValueLabel;
}
export interface FlatBrandEntry {
    value: string;
    value_sub_brand: string;
    label: string;
    image_url: string;
    image_variants: Record<string, string>;
}
export interface BrandCountryEntry {
    brands: Array<BrandEntry | FlatBrandEntry>;
    default: (BrandValueLabel & {
        sub_brands?: BrandValueLabel[];
        default?: BrandValueLabel;
    }) | FlatBrandEntry | Record<string, never>;
}
export type BrandValuesByCountry = Record<string, BrandCountryEntry>;
export interface BrandPresetValue {
    values: BrandValuesByCountry;
    default: BrandValueLabel[];
    enabled: boolean;
}
export declare function isBrandFilterItem(value: unknown): value is BrandFilterItem;
