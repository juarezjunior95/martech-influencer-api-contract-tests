/**
 * JWT scope strings that grant viewer access to country options in
 * preset responses (RFC-003 §4.8 + scope-based filtering extension).
 *
 * `ZONE` keys map zone codes (matching the `zone` field on
 * `CountryRecord`) to the JWT scope that grants access to that zone.
 */
export const VIEWER_SCOPES = {
  GLOBAL: "OneWayReports.GlobalViewer.Read",
  COUNTRY: "OneWayReports.CountryViewer.Read",
  ZONE: {
    AFR: "OneWayReports.AfricaViewer.Read",
    APAC: "OneWayReports.AsiaPacificViewer.Read",
    EUR: "OneWayReports.EuropeViewer.Read",
    MAZ: "OneWayReports.MiddleAmericasViewer.Read",
    NAZ: "OneWayReports.NorthAmericasViewer.Read",
    SAZ: "OneWayReports.SouthAmericasViewer.Read",
  },
} as const;

export type ZoneScopeKey = keyof typeof VIEWER_SCOPES.ZONE;
