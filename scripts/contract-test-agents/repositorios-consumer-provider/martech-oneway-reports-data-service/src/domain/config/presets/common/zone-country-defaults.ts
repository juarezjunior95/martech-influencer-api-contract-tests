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
 * Inputs:
 *   - `effective`: zones the response is allowed to expose (already
 *     filtered by `zoneScope` and user reachability).
 *   - `user`: authenticated user (JWT-derived policy + `country`
 *     claim).
 *   - `availableCountryIds` (optional): country ids the response
 *     actually contains, after `country.scope` and per-country JWT
 *     trimming. When provided, every country candidate must be a
 *     member; otherwise it's ignored. Pass `undefined` from handlers
 *     that don't restrict per-country (e.g. the `zone` handler).
 *
 * Selection rules, in order of precedence:
 *   1. If `effective` includes `ABI` (Global): zone = country = `ABI`.
 *   2. Else, if the user's JWT `country` claim is accessible, present
 *      in `availableCountryIds` (when given), AND its home zone is
 *      in `effective`: that country + that zone.
 *   3. Else, if the JWT `country` claim's home zone is itself in
 *      `effective`: that zone + the first available country in it.
 *   4. Else (fallback): the first zone in `effective` (registry
 *      order) that has at least one available country + that country.
 *
 * When no zone in `effective` has any available country, the country
 * default is left empty (zone default still emitted).
 */
export interface ZoneCountryEntry {
  value: string;
  label: string;
  quick_filter_label: string;
}

export interface ZoneCountryDefaults {
  zone: ZoneCountryEntry;
  country: ZoneCountryEntry;
}

const ABI_DEFAULT: ZoneCountryDefaults = {
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

export function computeZoneCountryDefaults(
  effective: string[],
  user: UserEntity | undefined,
  availableCountryIds?: ReadonlySet<string>,
): ZoneCountryDefaults {
  if (effective.includes(GLOBAL_ZONE)) {
    return ABI_DEFAULT;
  }

  const isAvailable = (countryId: string): boolean => {
    if (availableCountryIds && !availableCountryIds.has(countryId)) {
      return false;
    }
    return !user || user.hasCountryAccess(countryId);
  };

  const regional = effective.filter((id) => id !== GLOBAL_ZONE);
  if (regional.length === 0) {
    return ABI_DEFAULT;
  }

  const orderedZones = orderByRegistry(regional, zonesRegistry);

  const userCountryId = user?.country ? normalizeCountryId(user.country) : null;
  const userCountryRecord = userCountryId
    ? countriesRegistry[userCountryId]
    : undefined;

  // Rule 2: user country is available (reachable + in scope) and its
  // zone is in effective.
  if (
    userCountryRecord &&
    orderedZones.includes(userCountryRecord.zone) &&
    isAvailable(userCountryRecord.id)
  ) {
    return {
      zone: zoneEntry(zonesRegistry[userCountryRecord.zone]),
      country: countryEntry(userCountryRecord),
    };
  }

  // Rule 3: user's home zone is in effective; pick the first
  // available country in it (per registry order).
  if (userCountryRecord && orderedZones.includes(userCountryRecord.zone)) {
    const zone = zonesRegistry[userCountryRecord.zone];
    const firstCountry = firstAvailableCountryInZone(zone.id, isAvailable);
    if (firstCountry) {
      return {
        zone: zoneEntry(zone),
        country: countryEntry(firstCountry),
      };
    }
  }

  // Rule 4 (fallback): first zone in effective with at least one
  // available country.
  for (const zoneId of orderedZones) {
    const zone = zonesRegistry[zoneId];
    if (!zone) continue;
    const firstCountry = firstAvailableCountryInZone(zoneId, isAvailable);
    if (firstCountry) {
      return {
        zone: zoneEntry(zone),
        country: countryEntry(firstCountry),
      };
    }
  }

  // Last resort: first zone in effective even without an available
  // country (defensive — country.values for that zone would be empty).
  const firstZone = zonesRegistry[orderedZones[0]];
  return {
    zone: zoneEntry(firstZone),
    country: { value: "", label: "", quick_filter_label: "" },
  };
}

function zoneEntry(zone: ZoneRecord): ZoneCountryEntry {
  return {
    value: zone.id,
    label: zone.title,
    quick_filter_label: zone.quick_filter_label,
  };
}

function countryEntry(country: CountryRecord): ZoneCountryEntry {
  return {
    value: country.id,
    label: country.title,
    quick_filter_label: country.quick_filter_label,
  };
}

function firstAvailableCountryInZone(
  zoneId: string,
  isAvailable: (countryId: string) => boolean,
): CountryRecord | undefined {
  for (const record of Object.values(countriesRegistry)) {
    if (record.zone === zoneId && isAvailable(record.id)) {
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
