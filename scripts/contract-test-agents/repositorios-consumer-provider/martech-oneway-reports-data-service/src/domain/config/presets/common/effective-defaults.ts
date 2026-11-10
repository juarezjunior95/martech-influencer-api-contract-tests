import { UserEntity } from "@domain/entities/user.entity";
import {
  CountryRecord,
  countriesRegistry,
} from "@domain/registries/countries.registry";
import { ZoneRecord, zonesRegistry } from "@domain/registries/zones.registry";

const GLOBAL_ZONE = "ABI";

/**
 * Default zone + country selection emitted alongside `values` in the
 * `zone` and `country` preset responses. Both handlers consume this
 * single utility so their `default` fields stay perfectly in sync.
 *
 * Selection rules, in order of precedence:
 *   1. If the user can reach `ABI` (Global): zone = country = `ABI`.
 *   2. Else, if the user's JWT `country` claim is accessible AND its
 *      home zone is in `effective`: that country + that zone.
 *   3. Else, if the JWT `country` claim's home zone is itself in
 *      `effective`: that zone + the first accessible country in it
 *      (registry order).
 *   4. Else (fallback): the first zone in `effective` (registry order)
 *      + the first accessible country in that zone.
 *
 * When no zone in `effective` has any accessible country, the country
 * default is left empty (zone default still emitted).
 */
export interface EffectiveDefaultEntry {
  value: string;
  label: string;
  quick_filter_label: string;
}

export interface EffectiveDefaults {
  zone: EffectiveDefaultEntry;
  country: EffectiveDefaultEntry;
}

const ABI_DEFAULT: EffectiveDefaults = {
  zone: {
    value: GLOBAL_ZONE,
    label: "Global",
    quick_filter_label: "Global",
  },
  country: {
    value: GLOBAL_ZONE,
    label: "Global",
    quick_filter_label: "Global",
  },
};

export function computeEffectiveDefaults(
  effective: string[],
  user: UserEntity | undefined,
): EffectiveDefaults {
  if (effective.includes(GLOBAL_ZONE)) {
    return ABI_DEFAULT;
  }

  const accessible = (countryId: string): boolean =>
    !user || user.hasCountryAccess(countryId);

  const regional = effective.filter((id) => id !== GLOBAL_ZONE);
  if (regional.length === 0) {
    return ABI_DEFAULT;
  }

  const orderedZones = orderByRegistry(regional, zonesRegistry);

  const userCountryId = user?.country ? normalizeCountryId(user.country) : null;
  const userCountryRecord = userCountryId
    ? countriesRegistry[userCountryId]
    : undefined;

  // Rule 2: user country is accessible and its zone is in effective.
  if (
    userCountryRecord &&
    orderedZones.includes(userCountryRecord.zone) &&
    accessible(userCountryRecord.id)
  ) {
    return {
      zone: zoneEntry(zonesRegistry[userCountryRecord.zone]),
      country: countryEntry(userCountryRecord),
    };
  }

  // Rule 3: user country exists but unreachable; its zone is reachable.
  if (userCountryRecord && orderedZones.includes(userCountryRecord.zone)) {
    const zone = zonesRegistry[userCountryRecord.zone];
    const firstCountry = firstAccessibleCountryInZone(zone.id, accessible);
    if (firstCountry) {
      return {
        zone: zoneEntry(zone),
        country: countryEntry(firstCountry),
      };
    }
  }

  // Rule 4 (fallback): first zone in effective with at least one
  // accessible country.
  for (const zoneId of orderedZones) {
    const zone = zonesRegistry[zoneId];
    if (!zone) continue;
    const firstCountry = firstAccessibleCountryInZone(zoneId, accessible);
    if (firstCountry) {
      return {
        zone: zoneEntry(zone),
        country: countryEntry(firstCountry),
      };
    }
  }

  // Last resort: first zone in effective even without an accessible
  // country (defensive — country.values for that zone would be empty).
  const firstZone = zonesRegistry[orderedZones[0]];
  return {
    zone: zoneEntry(firstZone),
    country: { value: "", label: "", quick_filter_label: "" },
  };
}

function zoneEntry(zone: ZoneRecord): EffectiveDefaultEntry {
  return {
    value: zone.id,
    label: zone.title,
    quick_filter_label: zone.quick_filter_label,
  };
}

function countryEntry(country: CountryRecord): EffectiveDefaultEntry {
  return {
    value: country.id,
    label: country.title,
    quick_filter_label: country.quick_filter_label,
  };
}

function firstAccessibleCountryInZone(
  zoneId: string,
  accessible: (countryId: string) => boolean,
): CountryRecord | undefined {
  for (const record of Object.values(countriesRegistry)) {
    if (record.zone === zoneId && accessible(record.id)) {
      return record;
    }
  }
  return undefined;
}

/**
 * Sort `ids` by their order of declaration in `registry` so the
 * "first zone" / "first country" rules stay deterministic and
 * predictable across requests.
 */
function orderByRegistry<T extends ZoneRecord>(
  ids: string[],
  registry: Record<string, T>,
): string[] {
  const order = new Map(Object.keys(registry).map((id, idx) => [id, idx]));
  return [...ids].sort((a, b) => {
    const ai = order.get(a) ?? Number.MAX_SAFE_INTEGER;
    const bi = order.get(b) ?? Number.MAX_SAFE_INTEGER;
    return ai - bi;
  });
}

/**
 * Normalize a JWT `country` claim (ISO2 or ISO3) into the canonical
 * ISO3 used as the registry key. Unknown values resolve to `null`.
 */
function normalizeCountryId(country: string): string | null {
  const upper = country.toUpperCase();
  if (countriesRegistry[upper]) {
    return upper;
  }
  for (const record of Object.values(countriesRegistry)) {
    if (record.iso2 === upper) {
      return record.id;
    }
  }
  return null;
}
