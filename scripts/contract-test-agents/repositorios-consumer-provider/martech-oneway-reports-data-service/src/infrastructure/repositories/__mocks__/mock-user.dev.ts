import { VIEWER_SCOPES } from "@domain/entities/scopes";

/**
 * DEV-ONLY user override.
 *
 * This file is imported by `CurrentUserRepository` ONLY when BOTH:
 *   - `process.env.NODE_ENV === "development"`, AND
 *   - `process.env.MOCK_USER_OVERRIDE === "true"`.
 *
 * In any other case the file is never required, so it can never leak
 * into a production response. Keep edits to this file out of release
 * branches and review them carefully in PRs.
 *
 * Two simple lists do a TOTAL override of the JWT payload:
 *   - `scopes`: JWT viewer scopes. Use `VIEWER_SCOPES.GLOBAL`,
 *     `VIEWER_SCOPES.COUNTRY`, `VIEWER_SCOPES.ZONE.<X>`.
 *   - `supportedCountries`: ISO2 country codes ("BR", "AR", "MZ", ...)
 *     used by `CountryViewer` to compute `policy.iso3Set`. Leave empty
 *     when the user is `unrestricted` or `all`.
 *
 * Common presets:
 *   - GlobalViewer (sees everything):
 *       scopes: [VIEWER_SCOPES.GLOBAL]
 *       supportedCountries: []
 *   - ZoneViewer for Africa only:
 *       scopes: [VIEWER_SCOPES.ZONE.AFR]
 *       supportedCountries: []
 *   - CountryViewer for Brazil only:
 *       scopes: [VIEWER_SCOPES.COUNTRY]
 *       supportedCountries: ["BR"]
 *   - ZoneViewer:AFR + CountryViewer:BR (the bug-repro user):
 *       scopes: [VIEWER_SCOPES.ZONE.AFR, VIEWER_SCOPES.COUNTRY]
 *       supportedCountries: ["BR"]
 */
export const mockUser = {
  country: "BR",
  scopes: [
    VIEWER_SCOPES.GLOBAL,
    VIEWER_SCOPES.COUNTRY,
    VIEWER_SCOPES.ZONE.APAC,
    // VIEWER_SCOPES.ZONE.AFR,
    // VIEWER_SCOPES.ZONE.EUR,
    // VIEWER_SCOPES.ZONE.MAZ,
    // VIEWER_SCOPES.ZONE.NAZ,
    // VIEWER_SCOPES.ZONE.SAZ,
  ],
  supportedCountries: [
    // "BR",
    // "EC",
    // "NG",
    // "SV",
    // "NO",
    // "DE",
    // "GH",
    // "SZ",
    // "GT",
    // "FR",
    // "PA",
    // "PY",
    // "HN",
    // "PE",
    // "IN",
    // "IT",
    // "IE",
    // "PT",
    // "JP",
    // "AT",
    // "AR",
    // "BE",
    // "LS",
    // "BO",
    // "LU",
    // "BW",
    // "MX",
    // "MZ",
    // "CA",
    // "CN",
    // "CL",
    // "CO",
    // "NA",
    // "NL",
    // "DK",
    // "UG",
    // "DO",
    // "KR",
    // "ZA",
    // "ES",
    // "GB",
    // "US",
    // "SE",
    // "TZ",
    // "CH",
    // "VN",
    // "UY",
    // "ZM",
  ],
} as const;
