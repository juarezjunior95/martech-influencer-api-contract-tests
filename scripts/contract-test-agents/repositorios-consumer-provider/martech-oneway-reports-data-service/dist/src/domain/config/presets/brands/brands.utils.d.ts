import { DataItem } from "@domain/entities/common/base-config.entity";
import { BrandCountryEntry, BrandEntry, BrandFilterItem, FlatBrandEntry } from "@domain/config/presets/brands/brands.types";
export declare const ALL = "All";
export interface BrandRow {
    country: string;
    brand: string;
    subBrand: string;
}
export interface BrandEntryOptions {
    includeSubBrands: boolean;
    includeAllSubBrands: boolean;
    flatten: boolean;
    subFieldLabel?: string;
}
export declare function validateBrandConfig(filter: BrandFilterItem): void;
export declare function pickString(row: DataItem, keys: string[]): string;
export declare function buildAllBrandEntry(includeSubBrands: boolean, flatten: boolean): BrandEntry;
export declare function buildBrandEntry(brand: string, subBrandSet: Set<string>, options: BrandEntryOptions): BrandEntry;
export declare function flattenBrands(entries: BrandEntry[]): FlatBrandEntry[];
export declare function resolveCountryDefault(country: string, entries: Array<BrandEntry | FlatBrandEntry>, includeSubBrands: boolean): BrandCountryEntry["default"];
export declare function cloneABIEntry(): BrandCountryEntry;
