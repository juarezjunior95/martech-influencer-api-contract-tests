import { ConfigService } from "@nestjs/config";
import { BrandImageFormat } from "@common/utils/images/brand-image-paths.constants";
import { CountryImageFormat } from "@common/utils/images/country-image-paths.constants";
export type ResolveBrandImageResult = {
    url: string;
    matched: string[];
    image_variants: Record<string, string>;
};
export type ResolveCountryImageResult = {
    url: string;
    matched: string[];
};
export declare class ImagesService {
    private readonly config;
    private readonly brandAliasToCanonical;
    private readonly brandCanonicalToAliases;
    private readonly countryAliasToCanonical;
    private readonly countryCanonicalToAliases;
    constructor(config: ConfigService, brandAliasToCanonical: Map<string, string>, brandCanonicalToAliases: Map<string, string[]>, countryAliasToCanonical: Map<string, string>, countryCanonicalToAliases: Map<string, string[]>);
    private getCdnBase;
    private joinCdnUrl;
    private static formatMatched;
    private brandRelativePath;
    private countryRelativePath;
    resolveBrand(name?: string, format?: BrandImageFormat, brandFamily?: string): ResolveBrandImageResult;
    resolveCountry(name?: string, format?: CountryImageFormat): ResolveCountryImageResult;
}
