import {
  CountryRecord,
  countriesRegistry,
} from "@domain/registries/countries.registry";

export const WILDCARD = "*";

const iso2ToRecord: Map<string, CountryRecord> = new Map(
  Object.values(countriesRegistry).map((r) => [r.iso2, r]),
);

/**
 * Expand an id list (or `["*"]`) into concrete registry records.
 * Invalid ids are silently dropped (matches RFC risk mitigation).
 */
export function resolveCountries(ids: string[]): CountryRecord[] {
  if (!Array.isArray(ids) || ids.length === 0) {
    return [];
  }

  const effectiveIds = ids.includes(WILDCARD)
    ? Object.keys(countriesRegistry)
    : ids;

  return effectiveIds
    .map((id) => countriesRegistry[id])
    .filter((record): record is CountryRecord => Boolean(record));
}

/**
 * Translate a 2-letter ISO code (e.g. JWT `supportedCountries` entries)
 * into the canonical CountryRecord, or `undefined` when the code is not
 * recognized.
 */
export function resolveCountryByIso2(iso2: string): CountryRecord | undefined {
  if (!iso2) {
    return undefined;
  }
  return iso2ToRecord.get(iso2.toUpperCase());
}

/**
 * Return every CountryRecord registered under the given zone code.
 * Unknown zones return an empty array.
 */
export function resolveCountriesByZone(zoneId: string): CountryRecord[] {
  if (!zoneId) {
    return [];
  }
  return Object.values(countriesRegistry).filter(
    (record) => record.zone === zoneId,
  );
}
