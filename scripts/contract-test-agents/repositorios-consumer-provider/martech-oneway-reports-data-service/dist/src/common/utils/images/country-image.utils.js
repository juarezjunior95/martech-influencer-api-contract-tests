"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeCountryName = normalizeCountryName;
exports.getCountryFlag = getCountryFlag;
const country_image_paths_constants_1 = require("./country-image-paths.constants");
const image_path_prefix_utils_1 = require("./image-path-prefix.utils");
const country_aliases_json_1 = __importDefault(require("../../resources/country-aliases.json"));
const COUNTRY_ALIASES = country_aliases_json_1.default;
function normalizeCountryName(value) {
    return decodeHtmlEntities(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/&/g, " and ")
        .toLowerCase()
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
function getCountryFlag(value, params) {
    if (value === null || value === undefined) {
        return "";
    }
    const format = params?.format || "icon";
    const normalizedValue = normalizeCountryName(String(value));
    const country = findCountry(normalizedValue);
    return (0, image_path_prefix_utils_1.withImagePathPrefix)(country
        ? createCountryImagePath(country, format)
        : country_image_paths_constants_1.COUNTRY_IMAGE_PLACEHOLDER_PATH);
}
function findCountry(value) {
    return findCountryInAliases(value);
}
function findCountryInAliases(searchValue) {
    return COUNTRY_ALIASES[searchValue];
}
function createCountryImagePath(countryCode, format) {
    if (format === "waving") {
        return `countries/waving/${countryCode}.png`;
    }
    return `countries/rounded_flags/${countryCode}.png`;
}
//# sourceMappingURL=country-image.utils.js.map