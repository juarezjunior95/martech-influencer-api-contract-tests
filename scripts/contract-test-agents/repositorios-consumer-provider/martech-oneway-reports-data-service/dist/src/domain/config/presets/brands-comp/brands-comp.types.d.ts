export declare const BRAND_COMP_DATASET_ID = "brand-subbrand-comp";
export declare const BRAND_COMP_DATASET_QUERY = "presets/brand/brand-subbrand-comp";
export declare const LEVEL_COMP = "COMP";
export interface BrandCompFilterItem {
    type: "brands-comp";
    label?: string;
    shortLabel?: string;
    source: "databricks";
    countries?: string[];
}
export interface BrandCompValueLabel {
    value: string;
    label: string;
    image_url: string;
    image_variants: Record<string, string>;
}
export interface BrandCompGroupBlock {
    group: string | number;
    values: BrandCompValueLabel[];
}
export type BrandCompValuesByCountry = Record<string, BrandCompGroupBlock[]>;
export interface BrandCompPresetValue {
    values: BrandCompValuesByCountry;
    default: BrandCompValueLabel[];
    enabled: boolean;
}
export declare function isBrandCompFilterItem(value: unknown): value is BrandCompFilterItem;
