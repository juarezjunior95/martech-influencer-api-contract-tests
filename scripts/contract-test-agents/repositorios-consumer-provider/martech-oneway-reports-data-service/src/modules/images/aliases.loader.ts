import brandAliases from "@common/resources/brand-aliases.json";
import countryAliases from "@common/resources/country-aliases.json";

export type BrandAliasJson = Record<string, string>;
export type CountryAliasJson = Record<string, string>;

/**
 * Direct from JSON: one insert per entry.
 */
export function buildAliasToCanonicalMap(
  json: BrandAliasJson | CountryAliasJson,
): Map<string, string> {
  return new Map(Object.entries(json));
}

/**
 * Single forward pass over the JSON: group alias keys by canonical value,
 * then sort each alias list for deterministic `matched` arrays.
 */
export function buildCanonicalToAliasesMap(
  json: BrandAliasJson | CountryAliasJson,
): Map<string, string[]> {
  const buckets = new Map<string, Set<string>>();

  for (const [aliasKey, canonical] of Object.entries(json)) {
    let set = buckets.get(canonical);
    if (!set) {
      set = new Set<string>();
      buckets.set(canonical, set);
    }
    set.add(aliasKey);
  }

  const out = new Map<string, string[]>();
  for (const [canonical, set] of buckets) {
    out.set(
      canonical,
      [...set].sort((a, b) => a.localeCompare(b)),
    );
  }

  return out;
}

export type LoadedImageAliasMaps = {
  brandAliasToCanonical: Map<string, string>;
  brandCanonicalToAliases: Map<string, string[]>;
  countryAliasToCanonical: Map<string, string>;
  countryCanonicalToAliases: Map<string, string[]>;
};

/**
 * Synchronous boot-time load: JSON is bundled via TypeScript (no runtime fs read).
 */
export function loadImageAliasMapsFromJson(): LoadedImageAliasMaps {
  const brand = brandAliases as BrandAliasJson;
  const country = countryAliases as CountryAliasJson;

  return {
    brandAliasToCanonical: buildAliasToCanonicalMap(brand),
    brandCanonicalToAliases: buildCanonicalToAliasesMap(brand),
    countryAliasToCanonical: buildAliasToCanonicalMap(country),
    countryCanonicalToAliases: buildCanonicalToAliasesMap(country),
  };
}
