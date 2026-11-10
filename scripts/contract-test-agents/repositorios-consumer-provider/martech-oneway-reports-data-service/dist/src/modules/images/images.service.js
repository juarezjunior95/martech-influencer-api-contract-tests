"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ImagesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const brand_image_utils_1 = require("../../common/utils/images/brand-image.utils");
const country_image_utils_1 = require("../../common/utils/images/country-image.utils");
const images_alias_tokens_1 = require("./images-alias-tokens");
const brand_image_paths_constants_1 = require("../../common/utils/images/brand-image-paths.constants");
const country_image_paths_constants_1 = require("../../common/utils/images/country-image-paths.constants");
let ImagesService = ImagesService_1 = class ImagesService {
    constructor(config, brandAliasToCanonical, brandCanonicalToAliases, countryAliasToCanonical, countryCanonicalToAliases) {
        this.config = config;
        this.brandAliasToCanonical = brandAliasToCanonical;
        this.brandCanonicalToAliases = brandCanonicalToAliases;
        this.countryAliasToCanonical = countryAliasToCanonical;
        this.countryCanonicalToAliases = countryCanonicalToAliases;
    }
    getCdnBase() {
        return this.config.get("CDN_BASE_URL") || "";
    }
    joinCdnUrl(relativePath) {
        const prefix = this.getCdnBase();
        const path = relativePath.replace(/^\/+/, "");
        return `${prefix}/${path}`;
    }
    static formatMatched(canonical, sortedAliasKeys) {
        const rest = sortedAliasKeys.filter((k) => k !== canonical);
        return [canonical, ...rest];
    }
    brandRelativePath(canonical, format) {
        return `brands/${canonical}/${format}.png`;
    }
    countryRelativePath(canonical, format) {
        if (format === "waving") {
            return `countries/waving/${canonical}.png`;
        }
        return `countries/rounded_flags/${canonical}.png`;
    }
    resolveBrand(name, format = "square", brandFamily) {
        const nm = name?.trim() ?? "";
        if (!nm) {
            return {
                url: this.joinCdnUrl(brand_image_paths_constants_1.BRAND_IMAGE_PLACEHOLDER_PATH),
                matched: [],
                image_variants: {},
            };
        }
        const { image_url, image_variants } = (0, brand_image_utils_1.getBrandImageFields)(nm, {
            format,
            brand_family: brandFamily?.trim() || undefined,
        });
        if (image_url.includes(brand_image_paths_constants_1.BRAND_IMAGE_PLACEHOLDER_PATH) ||
            Object.keys(image_variants).length === 0) {
            return {
                url: this.joinCdnUrl(brand_image_paths_constants_1.BRAND_IMAGE_PLACEHOLDER_PATH),
                matched: [],
                image_variants: {},
            };
        }
        const canonicalMatch = image_url.match(/brands\/([^/]+)\//);
        const canonical = canonicalMatch?.[1] ?? (0, brand_image_utils_1.normalizeBrandName)(nm);
        const sortedKeys = this.brandCanonicalToAliases.get(canonical) ?? [];
        const matched = ImagesService_1.formatMatched(canonical, sortedKeys);
        return {
            url: image_url,
            matched,
            image_variants,
        };
    }
    resolveCountry(name, format = "icon") {
        const nm = name?.trim() ?? "";
        const candidate = (0, country_image_utils_1.normalizeCountryName)(nm);
        const canonical = this.countryAliasToCanonical.get(candidate) ?? candidate;
        if (!this.countryCanonicalToAliases.has(canonical) || !nm) {
            return {
                url: this.joinCdnUrl(country_image_paths_constants_1.COUNTRY_IMAGE_PLACEHOLDER_PATH),
                matched: [],
            };
        }
        const sortedKeys = this.countryCanonicalToAliases.get(canonical) ?? [];
        const matched = ImagesService_1.formatMatched(canonical, sortedKeys);
        return {
            url: this.joinCdnUrl(this.countryRelativePath(canonical, format)),
            matched,
        };
    }
};
exports.ImagesService = ImagesService;
exports.ImagesService = ImagesService = ImagesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(images_alias_tokens_1.BRAND_ALIAS_TO_CANONICAL)),
    __param(2, (0, common_1.Inject)(images_alias_tokens_1.BRAND_CANONICAL_TO_ALIASES)),
    __param(3, (0, common_1.Inject)(images_alias_tokens_1.COUNTRY_ALIAS_TO_CANONICAL)),
    __param(4, (0, common_1.Inject)(images_alias_tokens_1.COUNTRY_CANONICAL_TO_ALIASES)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        Map,
        Map,
        Map,
        Map])
], ImagesService);
//# sourceMappingURL=images.service.js.map