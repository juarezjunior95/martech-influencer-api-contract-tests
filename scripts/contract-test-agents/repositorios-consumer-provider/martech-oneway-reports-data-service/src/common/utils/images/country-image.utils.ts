import {
  COUNTRY_IMAGE_PLACEHOLDER_PATH,
  CountryImageFormat,
} from "./country-image-paths.constants";
import { withImagePathPrefix } from "./image-path-prefix.utils";
import countryAliases from "../../resources/country-aliases.json";

const COUNTRY_ALIASES: Record<string, string> = countryAliases;

/**
 * Country image format processor parameters
 */
export interface CountryImageParams {
  format?: CountryImageFormat;
}

/**
 * Matches the migration script's `normalizeString(value, "snake")` helper.
 */
export function normalizeCountryName(value: string): string {
  return decodeHtmlEntities(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");
}

function decodeHtmlEntities(value: string): string {
  return String(value)
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&amp;/g, "&")
    .replace(/&apos;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"');
}

export function getCountryFlag(
  value: string | number,
  params?: CountryImageParams,
): string {
  if (value === null || value === undefined) {
    return "";
  }

  const format = params?.format || "icon";
  const normalizedValue = normalizeCountryName(String(value));

  const country = findCountry(normalizedValue);

  return withImagePathPrefix(
    country
      ? createCountryImagePath(country, format)
      : COUNTRY_IMAGE_PLACEHOLDER_PATH,
  );
}

function findCountry(value: string): string | undefined {
  return findCountryInAliases(value);
}

function findCountryInAliases(searchValue: string): string | undefined {
  return COUNTRY_ALIASES[searchValue];
}

function createCountryImagePath(
  countryCode: string,
  format: CountryImageFormat,
): string {
  if (format === "waving") {
    return `countries/waving/${countryCode}.png`;
  }

  return `countries/rounded_flags/${countryCode}.png`;
}
