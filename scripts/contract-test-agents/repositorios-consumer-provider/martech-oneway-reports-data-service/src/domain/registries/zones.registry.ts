import { VIEWER_SCOPES } from "@domain/entities/scopes";

/**
 * Central registry record for a zone.
 *
 * `id` is the short zone code used throughout countries and presets.
 * `scope` is the JWT scope string that grants access to this zone
 * (`null` for `ABI`, which is reserved for the Global viewer scope and
 * does not act as a country-grouping zone).
 *
 * Scope strings are sourced from `VIEWER_SCOPES` so that the registry
 * and the policy resolver share a single source of truth.
 */
export interface ZoneRecord {
  id: string;
  title: string;
  scope: string | null;
  /**
   * Short label used in compact UI surfaces (quick filters, breadcrumb
   * pills, etc.). Falls back to the same value as `title` when no
   * abbreviation is needed.
   */
  quick_filter_label: string;
}

export type ZonesRegistry = Record<string, ZoneRecord>;

const rawEntries: ZoneRecord[] = [
  { id: "ABI", title: "Global", scope: null, quick_filter_label: "Global" },
  {
    id: "AFR",
    title: "AFR",
    scope: VIEWER_SCOPES.ZONE.AFR,
    quick_filter_label: "AFR",
  },
  {
    id: "APAC",
    title: "APAC",
    scope: VIEWER_SCOPES.ZONE.APAC,
    quick_filter_label: "APAC",
  },
  {
    id: "EUR",
    title: "EUR",
    scope: VIEWER_SCOPES.ZONE.EUR,
    quick_filter_label: "EUR",
  },
  {
    id: "MAZ",
    title: "MAZ",
    scope: VIEWER_SCOPES.ZONE.MAZ,
    quick_filter_label: "MAZ",
  },
  {
    id: "NAZ",
    title: "NAZ",
    scope: VIEWER_SCOPES.ZONE.NAZ,
    quick_filter_label: "NAZ",
  },
  {
    id: "SAZ",
    title: "SAZ",
    scope: VIEWER_SCOPES.ZONE.SAZ,
    quick_filter_label: "SAZ",
  },
];

export const zonesRegistry: ZonesRegistry = rawEntries.reduce((acc, entry) => {
  acc[entry.id] = entry;
  return acc;
}, {} as ZonesRegistry);
