import { requestContextStorage } from "@common/utils/winston-context.format";
import type { ZoneCountryDefaults } from "@domain/config/presets/common/zone-country-defaults";
import {
  countriesRegistry,
  type CountryRecord,
} from "@domain/registries/countries.registry";
import {
  resolveCountriesByZone,
  resolveCountryByIso2,
} from "@domain/registries/resolver";
import { zonesRegistry } from "@domain/registries/zones.registry";
import { UserEntity } from "@domain/entities/user.entity";

import { ZONE_AFFINITY_GROUPS } from "./commercial-results.constants";

/** `candidates` reordered so zones near `userZone` come first. */
function orderZonesByAffinity(
  userZone: string,
  candidates: string[],
): string[] {
  const group =
    ZONE_AFFINITY_GROUPS.find((zones) => zones.includes(userZone)) ?? [];
  const near = group.filter(
    (zone) => zone !== userZone && candidates.includes(zone),
  );
  const rest = candidates.filter(
    (zone) => zone !== userZone && !near.includes(zone),
  );
  return [...near, ...rest];
}

function resolveUserCountryRecord(
  user?: UserEntity,
): CountryRecord | undefined {
  const claimed = user?.country ?? requestContextStorage.getStore()?.country;
  if (!claimed) return undefined;

  const upper = claimed.toUpperCase();
  return countriesRegistry[upper] ?? resolveCountryByIso2(upper);
}

function toZoneCountryDefaults(
  zoneId: string,
  country: CountryRecord,
): ZoneCountryDefaults | null {
  const zone = zonesRegistry[zoneId];
  if (!zone) return null;

  return {
    zone: {
      value: zone.id,
      label: zone.title,
      quick_filter_label: zone.quick_filter_label,
    },
    country: {
      value: country.id,
      label: country.title,
      quick_filter_label: country.quick_filter_label,
    },
  };
}

export function resolveCommercialGeoDefault(
  user: UserEntity | undefined,
  regionalEffective: string[],
  availableCountryIds: ReadonlySet<string>,
): ZoneCountryDefaults | null {
  const record = resolveUserCountryRecord(user);
  if (!record) return null;

  const isAvailable = (countryId: string): boolean =>
    availableCountryIds.has(countryId) &&
    (!user || user.hasCountryAccess(countryId));

  const firstInZone = (zoneId: string): CountryRecord | undefined =>
    resolveCountriesByZone(zoneId).find((candidate) =>
      isAvailable(candidate.id),
    );

  if (regionalEffective.includes(record.zone)) {
    if (isAvailable(record.id)) {
      return toZoneCountryDefaults(record.zone, record);
    }

    const sameZone = firstInZone(record.zone);
    if (sameZone) return toZoneCountryDefaults(record.zone, sameZone);
  }

  for (const zoneId of orderZonesByAffinity(record.zone, regionalEffective)) {
    const country = firstInZone(zoneId);
    if (country) return toZoneCountryDefaults(zoneId, country);
  }

  return null;
}
