import { UserEntity } from "@domain/entities/user.entity";
import {
  CountryRecord,
  countriesRegistry,
} from "@domain/registries/countries.registry";
import { zonesRegistry } from "@domain/registries/zones.registry";

const GLOBAL_ZONE = "ABI";

/**
 * Compute the set of zones that the response is allowed to expose for
 * the current request. This is the single source of truth shared by
 * the `zone` and `country` preset handlers so their outputs stay
 * consistent (every zone bucket on the country side has a matching
 * row on the zone side, and vice versa).
 *
 * Inputs:
 *   - `zoneScope`: page-level zone allow-list (declared via the
 *     `home.preset.ts` BFF helper, mirrored to both presets). When
 *     omitted, every zone in the registry is candidate.
 *     Special id `ABI` acts as a wildcard for zones (no zone
 *     restriction) AND is itself only emitted when explicitly listed
 *     or when the user is `unrestricted`/`all`.
 *   - `user`: authenticated user; its `policy` and `scopes` decide
 *     which zones the user can actually reach, either directly via
 *     `ZoneViewer:<zone>` scopes or transitively via accessible
 *     countries (a CountryViewer with access to BRA implies SAZ).
 *
 * Output:
 *   - `effective`: ordered list of zone ids that should appear in
 *     `zone.values` and define which buckets `country.values` may
 *     emit.
 *   - `includesGlobal`: convenience flag (`effective.includes("ABI")`).
 */
export interface EffectiveZones {
  effective: string[];
  includesGlobal: boolean;
}

export interface ComputeEffectiveZonesOptions {
  /** When true, every zone in `zoneScope` is emitted without applying
   *  the user's reachability filter. Used by `NO_VALIDATION_PAGES`. */
  skipReachabilityFilter?: boolean;
}

export function computeEffectiveZones(
  zoneScope: string[] | undefined,
  user: UserEntity | undefined,
  options?: ComputeEffectiveZonesOptions,
): EffectiveZones {
  const candidate = candidateZonesFromScope(zoneScope);

  if (options?.skipReachabilityFilter) {
    return {
      effective: candidate,
      includesGlobal: candidate.includes(GLOBAL_ZONE),
    };
  }

  const reachable = reachableZonesForUser(user);

  const effective = candidate.filter((zone) => {
    if (zone === GLOBAL_ZONE) {
      return reachable.global;
    }
    return reachable.zones.has(zone);
  });

  return {
    effective,
    includesGlobal: effective.includes(GLOBAL_ZONE),
  };
}

/**
 * Resolve the zone allow-list before reachability is applied.
 * `ABI` in `zoneScope` is the wildcard sentinel: it expands to every
 * registered zone (regional + global). When `zoneScope` is omitted,
 * we also expand to every registered zone — but in that case `ABI`
 * is included as an explicit candidate, leaving the reachability
 * step to drop it for users who don't qualify.
 */
function candidateZonesFromScope(zoneScope: string[] | undefined): string[] {
  const allZones = Object.keys(zonesRegistry);
  if (!zoneScope || zoneScope.length === 0) {
    return allZones;
  }
  if (zoneScope.includes(GLOBAL_ZONE) && zoneScope.length === 1) {
    return allZones;
  }
  return zoneScope.filter((id) => Boolean(zonesRegistry[id]));
}

/**
 * Compute which zones the user can reach for the response. Splits
 * the result into a `global` flag (drives the synthetic `ABI`
 * bucket) and a `zones` set (regional zones).
 *
 * Reachability sources:
 *   1. `unrestricted` / `all` (GlobalViewer or no JWT): every zone
 *      including global.
 *   2. `ZoneViewer:<zone>` scope: that zone is reachable.
 *   3. `explicit` country access (CountryViewer with
 *      `supportedCountries`, or `country` claim): the zones owning
 *      those countries are reachable transitively.
 *   4. `deny`: nothing.
 */
function reachableZonesForUser(user: UserEntity | undefined): {
  global: boolean;
  zones: Set<string>;
} {
  if (!user) {
    return allReachable();
  }

  switch (user.policy.mode) {
    case "unrestricted":
    case "all":
      return allReachable();
    case "deny":
      return { global: false, zones: new Set<string>() };
    case "explicit": {
      const zones = new Set<string>();
      for (const countryId of user.policy.iso3Set) {
        const record: CountryRecord | undefined = countriesRegistry[countryId];
        if (record) {
          zones.add(record.zone);
        }
      }
      return { global: false, zones };
    }
  }
}

function allReachable(): { global: boolean; zones: Set<string> } {
  const zones = new Set(Object.keys(zonesRegistry));
  zones.delete(GLOBAL_ZONE);
  return { global: true, zones };
}
