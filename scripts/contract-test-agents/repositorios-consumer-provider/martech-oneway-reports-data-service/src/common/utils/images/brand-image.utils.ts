import {
  BRAND_IMAGE_PLACEHOLDER_PATH,
  BrandImageFormat,
} from "./brand-image-paths.constants";
import { withImagePathPrefix } from "./image-path-prefix.utils";
import brandAliases from "../../resources/brand-aliases.json";

const BRAND_ALIASES: Record<string, string> = brandAliases;

/**
 * Brand image format processor parameters
 */
export interface BrandImageParams {
  format?: BrandImageFormat;
  brand_family?: string;
}

/**
 * Matches the migration script's `normalizeString(value, "snake")` helper.
 */
export function normalizeBrandName(value: string): string {
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

export function getBrandImage(
  value: string | number,
  params?: BrandImageParams,
): string {
  if (value === null || value === undefined) {
    return "";
  }

  const format = params?.format || "square";
  const normalizedValue = normalizeBrandName(String(value));
  const brand = findBrand(normalizedValue, params?.brand_family);

  return withImagePathPrefix(
    brand ? createBrandImagePath(brand, format) : BRAND_IMAGE_PLACEHOLDER_PATH,
  );
}

/**
 * Single URL for presets/APIs where the client must not pick square vs table:
 * always the canonical **square** asset when the brand resolves; otherwise the
 * prefixed {@link BRAND_IMAGE_PLACEHOLDER_PATH} (no-image / "no-im" placeholder).
 */
export function getBrandImageSingleUrl(
  value: string | number,
  params?: BrandImageParams,
): string {
  return getBrandImage(value, { ...params, format: "square" });
}

function resolveBrandAlias(
  normalizedValue: string,
  options?: { allowPrefix?: boolean },
): string | undefined {
  let bestKey: string | undefined;
  let bestCanonical: string | undefined;

  for (const [aliasKey, canonical] of Object.entries(BRAND_ALIASES)) {
    if (normalizedValue === aliasKey) {
      return canonical;
    }
    if (
      normalizedValue.startsWith(`${aliasKey}_`) &&
      (!bestKey || aliasKey.length > bestKey.length)
    ) {
      const prefixAllowed =
        options?.allowPrefix === true || aliasKey.includes("_");
      if (prefixAllowed) {
        bestKey = aliasKey;
        bestCanonical = canonical;
      }
    }
  }

  return bestCanonical;
}

function findBrand(value: string, brand_family?: string): string | undefined {
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

function createBrandImagePath(
  canonicalBrand: string,
  format: BrandImageFormat,
): string {
  return `brands/${canonicalBrand}/${format}.png`;
}

export function getBrandImageVariants(
  value: string | number,
  params?: Pick<BrandImageParams, "brand_family">,
): Record<string, string> {
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
    square: withImagePathPrefix(createBrandImagePath(brand, "square")),
    table: withImagePathPrefix(createBrandImagePath(brand, "table")),
  };
}

export function getBrandImageFields(
  value: string | number,
  params?: BrandImageParams,
): { image_url: string; image_variants: Record<string, string> } {
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
