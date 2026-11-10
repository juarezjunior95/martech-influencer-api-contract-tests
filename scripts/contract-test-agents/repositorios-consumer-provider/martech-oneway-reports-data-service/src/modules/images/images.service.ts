import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  getBrandImageFields,
  normalizeBrandName,
} from "@common/utils/images/brand-image.utils";
import { normalizeCountryName } from "@common/utils/images/country-image.utils";
import {
  BRAND_ALIAS_TO_CANONICAL,
  BRAND_CANONICAL_TO_ALIASES,
  COUNTRY_ALIAS_TO_CANONICAL,
  COUNTRY_CANONICAL_TO_ALIASES,
} from "./images-alias-tokens";
import {
  BRAND_IMAGE_PLACEHOLDER_PATH,
  BrandImageFormat,
} from "@common/utils/images/brand-image-paths.constants";
import {
  COUNTRY_IMAGE_PLACEHOLDER_PATH,
  CountryImageFormat,
} from "@common/utils/images/country-image-paths.constants";

export type ResolveBrandImageResult = {
  url: string;
  matched: string[];
  image_variants: Record<string, string>;
};

export type ResolveCountryImageResult = {
  url: string;
  matched: string[];
};

@Injectable()
export class ImagesService {
  constructor(
    private readonly config: ConfigService,
    @Inject(BRAND_ALIAS_TO_CANONICAL)
    private readonly brandAliasToCanonical: Map<string, string>,
    @Inject(BRAND_CANONICAL_TO_ALIASES)
    private readonly brandCanonicalToAliases: Map<string, string[]>,
    @Inject(COUNTRY_ALIAS_TO_CANONICAL)
    private readonly countryAliasToCanonical: Map<string, string>,
    @Inject(COUNTRY_CANONICAL_TO_ALIASES)
    private readonly countryCanonicalToAliases: Map<string, string[]>,
  ) {}

  private getCdnBase(): string {
    return this.config.get<string>("CDN_BASE_URL") || "";
  }

  private joinCdnUrl(relativePath: string): string {
    const prefix = this.getCdnBase();
    const path = relativePath.replace(/^\/+/, "");
    return `${prefix}/${path}`;
  }

  private static formatMatched(
    canonical: string,
    sortedAliasKeys: string[],
  ): string[] {
    const rest = sortedAliasKeys.filter((k) => k !== canonical);
    return [canonical, ...rest];
  }

  private brandRelativePath(
    canonical: string,
    format: BrandImageFormat,
  ): string {
    return `brands/${canonical}/${format}.png`;
  }

  private countryRelativePath(
    canonical: string,
    format: CountryImageFormat,
  ): string {
    if (format === "waving") {
      return `countries/waving/${canonical}.png`;
    }
    return `countries/rounded_flags/${canonical}.png`;
  }

  resolveBrand(
    name?: string,
    format: BrandImageFormat = "square",
    brandFamily?: string,
  ): ResolveBrandImageResult {
    const nm = name?.trim() ?? "";
    if (!nm) {
      return {
        url: this.joinCdnUrl(BRAND_IMAGE_PLACEHOLDER_PATH),
        matched: [],
        image_variants: {},
      };
    }

    const { image_url, image_variants } = getBrandImageFields(nm, {
      format,
      brand_family: brandFamily?.trim() || undefined,
    });

    if (
      image_url.includes(BRAND_IMAGE_PLACEHOLDER_PATH) ||
      Object.keys(image_variants).length === 0
    ) {
      return {
        url: this.joinCdnUrl(BRAND_IMAGE_PLACEHOLDER_PATH),
        matched: [],
        image_variants: {},
      };
    }

    const canonicalMatch = image_url.match(/brands\/([^/]+)\//);
    const canonical = canonicalMatch?.[1] ?? normalizeBrandName(nm);
    const sortedKeys = this.brandCanonicalToAliases.get(canonical) ?? [];
    const matched = ImagesService.formatMatched(canonical, sortedKeys);

    return {
      url: image_url,
      matched,
      image_variants,
    };
  }

  resolveCountry(
    name?: string,
    format: CountryImageFormat = "icon",
  ): ResolveCountryImageResult {
    const nm = name?.trim() ?? "";

    const candidate = normalizeCountryName(nm);
    const canonical = this.countryAliasToCanonical.get(candidate) ?? candidate;

    if (!this.countryCanonicalToAliases.has(canonical) || !nm) {
      return {
        url: this.joinCdnUrl(COUNTRY_IMAGE_PLACEHOLDER_PATH),
        matched: [],
      };
    }

    const sortedKeys = this.countryCanonicalToAliases.get(canonical) ?? [];
    const matched = ImagesService.formatMatched(canonical, sortedKeys);

    return {
      url: this.joinCdnUrl(this.countryRelativePath(canonical, format)),
      matched,
    };
  }
}
