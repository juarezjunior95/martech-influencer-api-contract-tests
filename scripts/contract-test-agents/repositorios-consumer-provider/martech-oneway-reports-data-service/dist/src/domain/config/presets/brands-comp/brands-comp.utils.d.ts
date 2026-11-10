import { DataItem } from "@domain/entities/common/base-config.entity";
import { BrandCompGroupBlock, BrandCompValuesByCountry } from "@domain/config/presets/brands-comp/brands-comp.types";
export declare const ALL = "All";
export interface BrandCompRow {
    country: string;
    level: string;
    brand: string;
    subBrand: string;
}
export declare function pickString(row: DataItem, keys: string[]): string;
export declare function buildBrandGroupBlock(brand: string, subBrandSet: Set<string>): BrandCompGroupBlock;
export declare function buildCompValuesByCountry(rows: BrandCompRow[], level: string, allowedCountries: Set<string> | null): BrandCompValuesByCountry;
