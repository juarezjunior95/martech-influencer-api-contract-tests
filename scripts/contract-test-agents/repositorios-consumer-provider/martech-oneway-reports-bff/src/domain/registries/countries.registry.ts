/**
 * BFF-side country registry.
 *
 * Mirrors the country↔zone mapping kept by the Data-Service in
 * `src/domain/registries/countries.registry.ts`. The BFF only needs to
 * know which zone a country belongs to (to derive zone scopes from a
 * page-level country list) and the canonical list of valid ids
 * (to fail fast on typos when authoring presets).
 *
 * Keep this map in sync with martech-oneway-reports-data-service.
 *
 * `ABI` is the synthetic Global row. It is NOT a country wildcard:
 *   - In a country scope, it pulls the `ABI` zone in alongside the
 *     real countries listed.
 *   - To allow every zone/country, pass an empty list (or omit the
 *     argument) to {@link buildZoneCountryFilters}.
 */

export interface CountryRecord {
  id: string;
  zone: string;
}

export const ABI_GLOBAL_ID = "ABI";

const rawEntries: CountryRecord[] = [
  // AFR
  { id: "MOZ", zone: "AFR" },
  { id: "NGA", zone: "AFR" },
  { id: "ZAF", zone: "AFR" },
  { id: "TZA", zone: "AFR" },
  { id: "UGA", zone: "AFR" },
  { id: "ZMB", zone: "AFR" },
  // APAC
  { id: "CHN", zone: "APAC" },
  { id: "IND", zone: "APAC" },
  { id: "JPN", zone: "APAC" },
  { id: "KOR", zone: "APAC" },
  { id: "VNM", zone: "APAC" },
  // EUR
  { id: "BEL", zone: "EUR" },
  { id: "FRA", zone: "EUR" },
  { id: "DEU", zone: "EUR" },
  { id: "ITA", zone: "EUR" },
  { id: "NLD", zone: "EUR" },
  { id: "GBR", zone: "EUR" },
  // MAZ
  { id: "COL", zone: "MAZ" },
  { id: "DOM", zone: "MAZ" },
  { id: "ECU", zone: "MAZ" },
  { id: "SLV", zone: "MAZ" },
  { id: "GTM", zone: "MAZ" },
  { id: "HND", zone: "MAZ" },
  { id: "MEX", zone: "MAZ" },
  { id: "PAN", zone: "MAZ" },
  { id: "PER", zone: "MAZ" },
  // NAZ
  { id: "CAN", zone: "NAZ" },
  { id: "USA", zone: "NAZ" },
  // SAZ
  { id: "ARG", zone: "SAZ" },
  { id: "BOL", zone: "SAZ" },
  { id: "BRA", zone: "SAZ" },
  { id: "CHL", zone: "SAZ" },
  { id: "PRY", zone: "SAZ" },
  { id: "URY", zone: "SAZ" },
];

/**
 * Indexed lookup of every registered country. Use this for iteration
 * or `id`-driven access (e.g. {@link buildZoneCountryFilters} validates
 * incoming ids against this map).
 */
export const countriesRegistry: Record<string, CountryRecord> =
  rawEntries.reduce(
    (acc, entry) => {
      acc[entry.id] = entry;
      return acc;
    },
    {} as Record<string, CountryRecord>,
  );

/**
 * Authoring-friendly accessor: `countries.BRA.id`, `countries.ARG.zone`.
 * Each property is the same {@link CountryRecord} stored in
 * {@link countriesRegistry} so identity comparisons work either way.
 */
export const countries = countriesRegistry as {
  readonly [id: string]: CountryRecord;
};
