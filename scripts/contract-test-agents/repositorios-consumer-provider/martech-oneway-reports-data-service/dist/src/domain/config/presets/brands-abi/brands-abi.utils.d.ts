import { DataItem } from "@domain/entities/common/base-config.entity";
import { BrandAbiGroupBlock, BrandAbiValueLabel, BrandAbiValuesByCountry } from "@domain/config/presets/brands-abi/brands-abi.types";
export declare const ALL = "All";
export declare function brandAbiAllLabel(): BrandAbiValueLabel;
export interface BrandAbiRow {
    country: string;
    level: string;
    brand: string;
    subBrand: string;
}
export declare function pickString(row: DataItem, keys: string[]): string;
export declare function buildBrandGroupBlock(brand: string, subBrandSet: Set<string>): BrandAbiGroupBlock;
export declare function buildAbiValuesByCountry(rows: BrandAbiRow[], level: string, allowedCountries: Set<string> | null): BrandAbiValuesByCountry;
