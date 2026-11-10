"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeBrandName = normalizeBrandName;
exports.getBrandImage = getBrandImage;
exports.getBrandImageSingleUrl = getBrandImageSingleUrl;
exports.getBrandImageVariants = getBrandImageVariants;
exports.getBrandImageFields = getBrandImageFields;
const brand_image_paths_constants_1 = require("./brand-image-paths.constants");
const image_path_prefix_utils_1 = require("./image-path-prefix.utils");
const brand_aliases_json_1 = __importDefault(require("../../resources/brand-aliases.json"));
const BRAND_ALIASES = brand_aliases_json_1.default;
function normalizeBrandName(value) {
    return decodeHtmlEntities(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/&/g, " and ")
        .toLowerCase()
        .replace(/[\u0027\u2018\u2019]/g, "")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .replace(/_+/g, "_");
}
function decodeHtmlEntities(value) {
    return String(value)
        .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
        .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
        .replace(/&amp;/g, "&")
        .replace(/&apos;/g, "'")
        .replace(/&#039;/g, "'")
        .replace(/&quot;/g, '"');
}
function getBrandImage(value, params) {
    if (value === null || value === undefined) {
        return "";
    }
    const format = params?.format || "square";
    const normalizedValue = normalizeBrandName(String(value));
    const brand = findBrand(normalizedValue, params?.brand_family);
    return (0, image_path_prefix_utils_1.withImagePathPrefix)(brand ? createBrandImagePath(brand, format) : brand_image_paths_constants_1.BRAND_IMAGE_PLACEHOLDER_PATH);
}
function getBrandImageSingleUrl(value, params) {
    return getBrandImage(value, { ...params, format: "square" });
}
function resolveBrandAlias(normalizedValue, options) {
    let bestKey;
    let bestCanonical;
    for (const [aliasKey, canonical] of Object.entries(BRAND_ALIASES)) {
        if (normalizedValue === aliasKey) {
            return canonical;
        }
        if (normalizedValue.startsWith(`${aliasKey}_`) &&
            (!bestKey || aliasKey.length > bestKey.length)) {
            const prefixAllowed = options?.allowPrefix === true || aliasKey.includes("_");
            if (prefixAllowed) {
                bestKey = aliasKey;
                bestCanonical = canonical;
            }
        }
    }
    return bestCanonical;
}
function findBrand(value, brand_family) {
    const resolved = resolveBrandAlias(value, {
        allowPrefix: Boolean(brand_family),
    });
    if (resolved) {
        return resolved;
    }
    if (!brand_family) {
        return undefined;
    }
    const normalizedFamily = normalizeBrandName(brand_family);
    if (normalizedFamily === value) {
        return undefined;
    }
    return resolveBrandAlias(normalizedFamily);
}
function createBrandImagePath(canonicalBrand, format) {
    return `brands/${canonicalBrand}/${format}.png`;
}
function getBrandImageVariants(value, params) {
    if (value === null || value === undefined) {
        return {};
    }
    const nm = String(value).trim();
    if (!nm) {
        return {};
    }
    const normalizedValue = normalizeBrandName(nm);
    const brand = findBrand(normalizedValue, params?.brand_family);
    if (!brand) {
        return {};
    }
    return {
        square: (0, image_path_prefix_utils_1.withImagePathPrefix)(createBrandImagePath(brand, "square")),
        table: (0, image_path_prefix_utils_1.withImagePathPrefix)(createBrandImagePath(brand, "table")),
    };
}
function getBrandImageFields(value, params) {
    const image_variants = getBrandImageVariants(value, params);
    if (Object.keys(image_variants).length === 0) {
        return {
            image_url: getBrandImage(value, params),
            image_variants: {},
        };
    }
    const format = params?.format || "square";
    return {
        image_url: image_variants[format] ?? image_variants.square,
        image_variants,
    };
}
//# sourceMappingURL=brand-image.utils.js.map