/** Boot-built map: normalized alias key → canonical brand slug */
export const BRAND_ALIAS_TO_CANONICAL = Symbol("BRAND_ALIAS_TO_CANONICAL");

/** Boot-built map: canonical brand slug → sorted alias keys from JSON (same target) */
export const BRAND_CANONICAL_TO_ALIASES = Symbol("BRAND_CANONICAL_TO_ALIASES");

/** Boot-built map: normalized alias key → canonical country code */
export const COUNTRY_ALIAS_TO_CANONICAL = Symbol("COUNTRY_ALIAS_TO_CANONICAL");

/** Boot-built map: canonical country code → sorted alias keys from JSON */
export const COUNTRY_CANONICAL_TO_ALIASES = Symbol(
  "COUNTRY_CANONICAL_TO_ALIASES",
);
