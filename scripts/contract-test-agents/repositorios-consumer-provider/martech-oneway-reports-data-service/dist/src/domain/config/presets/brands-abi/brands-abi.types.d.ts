export declare const BRAND_ABI_DATASET_ID = "brand-subbrand-comp";
export declare const BRAND_ABI_DATASET_QUERY = "presets/brand/brand-subbrand-comp";
export declare const LEVEL_ABI = "ABI";
export interface BrandAbiFilterItem {
    type: "brands-abi";
    label?: string;
    shortLabel?: string;
    source: "databricks";
    countries?: string[];
}
export interface BrandAbiValueLabel {
    value: string;
    label: string;
    image_url: string;
    image_variants: Record<string, string>;
}
export interface BrandAbiGroupBlock {
    group: string | number;
    values: BrandAbiValueLabel[];
}
export type BrandAbiValuesByCountry = Record<string, BrandAbiGroupBlock[]>;
export interface BrandAbiPresetValue {
    values: BrandAbiValuesByCountry;
    default: BrandAbiValueLabel;
    enabled: boolean;
}
export declare function isBrandAbiFilterItem(value: unknown): value is BrandAbiFilterItem;
