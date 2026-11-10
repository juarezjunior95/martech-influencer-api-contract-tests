export type BrandAliasJson = Record<string, string>;
export type CountryAliasJson = Record<string, string>;
export declare function buildAliasToCanonicalMap(json: BrandAliasJson | CountryAliasJson): Map<string, string>;
export declare function buildCanonicalToAliasesMap(json: BrandAliasJson | CountryAliasJson): Map<string, string[]>;
export type LoadedImageAliasMaps = {
    brandAliasToCanonical: Map<string, string>;
    brandCanonicalToAliases: Map<string, string[]>;
    countryAliasToCanonical: Map<string, string>;
    countryCanonicalToAliases: Map<string, string[]>;
};
export declare function loadImageAliasMapsFromJson(): LoadedImageAliasMaps;
