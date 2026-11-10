import { VIEWER_SCOPES, ZoneScopeKey } from "@domain/entities/scopes";
import { countriesRegistry } from "@domain/registries/countries.registry";
import {
  resolveCountriesByZone,
  resolveCountryByIso2,
} from "@domain/registries/resolver";

export interface UserEntityProps {
  scopes: string[];
  country: string | null;
  /**
   * JWT `supportedCountries` claim, as an ISO2 list. The entity
   * resolves this to ISO3 internally using the country registry.
   */
  supportedCountries: string[];
}

/**
 * Resolved permission set used by `PresetEntity.applyPermissionFilter`.
 *
 * - `unrestricted` — no JWT was decoded; every option passes through
 *   (PoC graceful degradation, RFC §4.8).
 * - `all` — `GlobalViewer` scope grants unrestricted access.
 * - `explicit` — closed set of allowed ISO3 country codes.
 * - `deny` — JWT was present but the user holds no viewer scope, so
 *   every country option is dropped.
 */
export type CountryAccessPolicy =
  | { mode: "unrestricted" }
  | { mode: "all" }
  | { mode: "explicit"; iso3Set: Set<string> }
  | { mode: "deny" };

/**
 * UserEntity represents the authenticated user for the current request.
 *
 * The constructor pre-computes a `CountryAccessPolicy` from the raw JWT
 * inputs (scopes, JWT `country` claim, JWT `supportedCountries` claim)
 * so downstream callers can rely on a single `hasCountryAccess` check.
 *
 * Precedence:
 *   GlobalViewer > ZoneViewer (any) > CountryViewer > deny.
 *
 * The JWT `country` claim only contributes to access when the user
 * holds `CountryViewer`. ZoneViewer-only users do NOT gain access to
 * their home country if it sits outside their zones — the `country`
 * claim is metadata for UX defaults (selection priority), not a
 * permission booster.
 */
export class UserEntity {
  readonly scopes: string[];
  readonly country: string | null;
  readonly supportedCountries: string[];
  readonly policy: CountryAccessPolicy;

  private constructor(props: UserEntityProps, policy: CountryAccessPolicy) {
    this.scopes = props.scopes;
    this.country = props.country;
    this.supportedCountries = props.supportedCountries;
    this.policy = policy;
  }

  /**
   * Build a UserEntity. Pass `null` for both `scopes` (or empty array)
   * AND `supportedCountries` when no JWT was decoded — the resulting
   * entity will be `unrestricted` for backward compatibility.
   */
  static create(props: UserEntityProps): UserEntity {
    const policy = computePolicy(props);
    return new UserEntity(props, policy);
  }

  /**
   * Effective ISO3 country list. Returned for compatibility with code
   * that previously read `getSupportedCountries()` directly. The list
   * is empty for `unrestricted` and `all` modes (callers should branch
   * on `policy.mode` for those cases).
   */
  getSupportedCountries(): string[] {
    if (this.policy.mode === "explicit") {
      return Array.from(this.policy.iso3Set);
    }
    return [];
  }

  hasCountryAccess(countryId: string): boolean {
    switch (this.policy.mode) {
      case "unrestricted":
      case "all":
        return true;
      case "deny":
        return false;
      case "explicit":
        return this.policy.iso3Set.has(countryId);
    }
  }
}

function computePolicy(props: UserEntityProps): CountryAccessPolicy {
  const hasJwtPayload =
    (props.scopes && props.scopes.length > 0) ||
    (props.supportedCountries && props.supportedCountries.length > 0) ||
    Boolean(props.country);

  if (!hasJwtPayload) {
    return { mode: "unrestricted" };
  }

  const scopes = new Set(props.scopes ?? []);
  const jwtCountryIso3 = jwtCountryToIso3(props.country);

  const supportedIso3 = scopes.has(VIEWER_SCOPES.COUNTRY)
    ? supportedCountriesToIso3(props.supportedCountries)
    : new Set<string>();
  if (scopes.has(VIEWER_SCOPES.COUNTRY) && jwtCountryIso3) {
    supportedIso3.add(jwtCountryIso3);
  }

  if (
    scopes.has(VIEWER_SCOPES.GLOBAL) ||
    coversEveryRegisteredCountry(supportedIso3)
  ) {
    return { mode: "all" };
  }

  const zoneIso3 = collectZoneCountries(scopes);
  const hasCountryViewer = scopes.has(VIEWER_SCOPES.COUNTRY);

  // Merge ZoneViewer + CountryViewer access.
  if (zoneIso3.size > 0 || (hasCountryViewer && supportedIso3.size > 0)) {
    const merged = new Set<string>(zoneIso3);
    if (hasCountryViewer) {
      for (const id of supportedIso3) {
        merged.add(id);
      }
    }
    return { mode: "explicit", iso3Set: merged };
  }

  if (hasCountryViewer) {
    return { mode: "deny" };
  }

  return { mode: "deny" };
}

function collectZoneCountries(scopes: Set<string>): Set<string> {
  const result = new Set<string>();
  for (const [zoneId, scope] of Object.entries(VIEWER_SCOPES.ZONE) as Array<
    [ZoneScopeKey, string]
  >) {
    if (scopes.has(scope)) {
      for (const country of resolveCountriesByZone(zoneId)) {
        result.add(country.id);
      }
    }
  }
  return result;
}

/**
 * `true` when the resolved ISO3 set already contains every country
 * present in the central `countriesRegistry`. Treated as functionally
 * equivalent to a `GlobalViewer` scope — the user has visibility into
 * the entire universe and `policy.mode` is promoted to `all`.
 *
 * Important for downstream callers that branch on `mode`: only `all`
 * (and `unrestricted`) emit the synthetic `ABI` Global row in the
 * `zone` / `country` presets.
 */
function coversEveryRegisteredCountry(iso3Set: Set<string>): boolean {
  const registered = Object.keys(countriesRegistry);
  if (registered.length === 0) {
    return false;
  }
  return registered.every((id) => iso3Set.has(id));
}

function supportedCountriesToIso3(
  supported: string[] | undefined,
): Set<string> {
  const result = new Set<string>();
  if (!supported) {
    return result;
  }
  for (const code of supported) {
    if (!code) {
      continue;
    }
    if (code === "*") {
      for (const c of Object.values(countriesRegistry)) {
        result.add(c.id);
      }
      continue;
    }
    const record = resolveCountryByIso2(code);
    if (record) {
      result.add(record.id);
    }
  }
  return result;
}

/**
 * Normalize the JWT `country` claim. Accepts either ISO2 (`"BR"`) or
 * ISO3 (`"BRA"`) and returns the canonical ISO3, or `null` if the
 * value is not recognized.
 */
function jwtCountryToIso3(country: string | null | undefined): string | null {
  if (!country) {
    return null;
  }
  const upper = country.toUpperCase();
  if (upper.length === 3) {
    return upper;
  }
  const record = resolveCountryByIso2(upper);
  return record?.id ?? null;
}
