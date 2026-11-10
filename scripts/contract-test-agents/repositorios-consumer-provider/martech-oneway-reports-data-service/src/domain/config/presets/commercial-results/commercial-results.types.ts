/**
 * Raw row shape returned by the owr_result_query_sp stored procedure
 * for the commercial-results filter dataset.
 */
export interface CommercialResultsFilterRawRow {
  country_iso_code_3: string;
  zone: string;
  region: string;
  period: string;
  brand: string;
  sub_brand: string;
  sku: string;
  channel: string;
  pack_type: string;
  category: string;
  non_alc_beer: string;
  growth_levers: string;
  beer_price_segment: string;
  portfolio: string;
}

export interface CommercialResultsOption {
  value: string;
  label: string;
  image_url?: string;
  image_variants?: Record<string, string>;
}

export interface CommercialResultsSkuOption extends CommercialResultsOption {
  sub_brand?: string;
}

export interface CommercialResultsCountryEntry {
  value: string;
  label: string;
  zone: string;
  quick_filter_label: string;
}

export interface CommercialResultsZoneOption {
  value: string;
  label: string;
}

export interface CommercialResultsPeriodOption {
  value: string;
  label: string;
  full: string;
}

/**
 * Generic dimension shape: enabled flag, a default selection, and the values list.
 * `TDefault` is the type of the default and list items.
 * `TValues` defaults to an array of TDefault but can be overridden to a
 * Record type for grouped dimensions (country, region, sku).
 */
export interface CommercialResultsDimension<TDefault, TValues = TDefault[]> {
  enabled: boolean;
  default: TDefault | null;
  values: TValues;
}

export type CommercialResultsZonesDimension =
  CommercialResultsDimension<CommercialResultsZoneOption>;

export type CommercialResultsCountryDimension = CommercialResultsDimension<
  CommercialResultsCountryEntry,
  Record<string, CommercialResultsCountryEntry[]>
>;

export type CommercialResultsRegionDimension = CommercialResultsDimension<
  CommercialResultsOption,
  Record<string, CommercialResultsOption[]>
>;

export type CommercialResultsPeriodsDimension =
  CommercialResultsDimension<CommercialResultsPeriodOption>;

export type CommercialResultsListDimension =
  CommercialResultsDimension<CommercialResultsOption>;

export type CommercialResultsSkuDimension = CommercialResultsDimension<
  CommercialResultsOption,
  Record<string, CommercialResultsSkuOption[]>
>;

/**
 * Fully typed output returned by CommercialResultsPresetHandler.handle().
 * Returned directly as the PresetResponse (flat shape — no wrapper key).
 */
export interface CommercialResultsFilterResponse {
  kpis: CommercialResultsListDimension;
  zones: CommercialResultsZonesDimension;
  country: CommercialResultsCountryDimension;
  region: CommercialResultsRegionDimension;
  periods: CommercialResultsPeriodsDimension;
  brands: CommercialResultsListDimension;
  sub_brands: CommercialResultsListDimension;
  channel: CommercialResultsListDimension;
  pack_type: CommercialResultsListDimension;
  sku: CommercialResultsSkuDimension;
  category: CommercialResultsListDimension;
  non_alcoholic: CommercialResultsListDimension;
  growth_levers: CommercialResultsListDimension;
  beer_price_segment: CommercialResultsListDimension;
  portfolios: CommercialResultsListDimension;
}

/** Dataset identifier for the main filter query (actual user filters). */
export const COMMERCIAL_RESULTS_DATASET_ID = "commercial-results";

/**
 * Dataset identifier for the brands dataset.
 * Brand is forced to "ALL" in the procedure to return all brand options
 * for the selected country/zone regardless of brand selection.
 */
export const COMMERCIAL_RESULTS_BRANDS_DATASET_ID = "commercial-results-brands";

/**
 * Dataset identifier for the geo dataset.
 * Zone and country are forced to "ABI" and brand to "ALL" to always
 * return the full geo + period list regardless of filter selection.
 */
export const COMMERCIAL_RESULTS_GEO_DATASET_ID = "commercial-results-geo";

/** Stored procedure name used in all three dataset calls. */
export const COMMERCIAL_RESULTS_SP_NAME =
  "7_value_creation_commercial-results_filter";

/** Dataset identifier for the Volume line-chart datasource. */
export const COMMERCIAL_RESULTS_VOLUME_LINE_CHART_DATASET_ID =
  "commercial-results-line-chart";

/** Dataset identifier for the Volume bar-chart datasource. */
export const COMMERCIAL_RESULTS_VOLUME_BAR_CHART_DATASET_ID =
  "commercial-results-bar-chart";

/** Dataset identifier for the Volume waterfall datasource. */
export const COMMERCIAL_RESULTS_VOLUME_WATERFALL_DATASET_ID =
  "commercial-results-waterfall";

/** Stored procedure name for the Volume line-chart datasource. */
export const COMMERCIAL_RESULTS_VOLUME_LINE_CHART_SP_NAME =
  "7_value_creation_commercial-results_volume_line-chart";

/** Stored procedure name for the Volume bar-chart datasource. */
export const COMMERCIAL_RESULTS_VOLUME_BAR_CHART_SP_NAME =
  "7_value_creation_commercial-results_volume_bar-chart";

/** Stored procedure name for the Volume waterfall datasource. */
export const COMMERCIAL_RESULTS_VOLUME_WATERFALL_SP_NAME =
  "7_value_creation_commercial-results_volume_waterfall";

/** Dataset identifier for the Volume big-numbers datasource. */
export const COMMERCIAL_RESULTS_VOLUME_BIG_NUMBERS_DATASET_ID =
  "commercial-results-big-numbers";

/** Stored procedure name for the Volume big-numbers datasource. */
export const COMMERCIAL_RESULTS_VOLUME_BIG_NUMBERS_SP_NAME =
  "7_value_creation_commercial-results_volume_big-numbers";

/** Dataset identifiers for the Net Revenue datasources. */
export const COMMERCIAL_RESULTS_NET_REVENUE_LINE_CHART_DATASET_ID =
  "commercial-results-net-revenue-line-chart";
export const COMMERCIAL_RESULTS_NET_REVENUE_BAR_CHART_DATASET_ID =
  "commercial-results-net-revenue-bar-chart";
export const COMMERCIAL_RESULTS_NET_REVENUE_WATERFALL_DATASET_ID =
  "commercial-results-net-revenue-waterfall";
export const COMMERCIAL_RESULTS_NET_REVENUE_BIG_NUMBERS_DATASET_ID =
  "commercial-results-net-revenue-big-numbers";

/** Stored procedure names for the Net Revenue datasources. */
export const COMMERCIAL_RESULTS_NET_REVENUE_LINE_CHART_SP_NAME =
  "7_value_creation_commercial-results_net-revenue_line-chart";
export const COMMERCIAL_RESULTS_NET_REVENUE_BAR_CHART_SP_NAME =
  "7_value_creation_commercial-results_net-revenue_bar-chart";
export const COMMERCIAL_RESULTS_NET_REVENUE_WATERFALL_SP_NAME =
  "7_value_creation_commercial-results_net-revenue_waterfall";
export const COMMERCIAL_RESULTS_NET_REVENUE_BIG_NUMBERS_SP_NAME =
  "7_value_creation_commercial-results_net-revenue_big-numbers";

/**
 * Filter names shared by every commercial-results datasource.
 */
export const COMMERCIAL_RESULTS_COMMON_FILTER_NAMES = [
  "dt_end",
  "zone",
  "country",
  "region",
  "period_type",
  "brand",
  "sub_brand",
  "sku",
  "pack_type",
  "channel",
  "category",
  "non_alcoholic",
  "growth_levers",
  "beer_price_segment",
  "portfolios",
] as const;

/**
 * Net Revenue uses the same filters as Volume and forwards the canonical KPI
 * marker expected by the NR statement ids.
 */
export const COMMERCIAL_RESULTS_NET_REVENUE_COMMON_FILTER_NAMES = [
  ...COMMERCIAL_RESULTS_COMMON_FILTER_NAMES,
  "kpi",
] as const;

export const COMMERCIAL_RESULTS_WATERFALL_FILTER_NAMES = [
  "waterfall_filter",
  "max_ranked",
] as const;

/**
 * Shape of the `commercial_results_filters` key inside `PresetDefinition`.
 * Kept minimal — only the fields the handler actually reads.
 */
export interface CommercialResultsPresetConfig {
  kpi?: string;
  brand?: string;
  country?: string;
  channel?: string;
  region?: string;
  pack_type?: string;
  category?: string;
  non_alcoholic?: string;
  growth_levers?: string;
  beer_price_segment?: string;
  portfolios?: string;
}

export function isCommercialResultsPresetConfig(
  val: unknown,
): val is CommercialResultsPresetConfig {
  return typeof val === "object" && val !== null && !Array.isArray(val);
}

/** True when a filter dimension is unset or any case-variant of "all". */
export function isCommercialResultsDimensionAll(
  value: string | undefined | null,
): boolean {
  return String(value ?? "ALL").toLowerCase() === "all";
}

/** True when brand is unset or any case-variant of "all". */
export function isCommercialResultsBrandAll(
  filters?: CommercialResultsPresetConfig,
): boolean {
  return isCommercialResultsDimensionAll(filters?.brand);
}

type CommercialResultsPresetConfigLegacy = CommercialResultsPresetConfig & {
  packType?: string;
  nonAlcoholic?: string;
  growthLevers?: string;
  beerPriceSegment?: string;
};

const COMMERCIAL_RESULTS_SCALAR_FILTER_KEYS = [
  "brand",
  "country",
  "channel",
  "region",
  "pack_type",
  "category",
  "non_alcoholic",
  "growth_levers",
  "beer_price_segment",
  "portfolios",
] as const satisfies ReadonlyArray<keyof CommercialResultsPresetConfig>;

/**
 * PresetEntity generically interprets comma-delimited query values as arrays.
 * Commercial Results filters are scalar business labels, so restore them at
 * this handler boundary before applying cross-filter rules.
 */
function restoreCommercialResultsScalar(value: unknown): unknown {
  return Array.isArray(value) ? value.map(String).join(", ") : value;
}

/**
 * `PresetEntity.applyOverrides` camelCases query keys (`pack_type` → `packType`).
 * Normalize back to snake_case fields the handler reads.
 */
export function normalizeCommercialResultsPresetConfig(
  raw: CommercialResultsPresetConfig | undefined,
): CommercialResultsPresetConfig | undefined {
  if (!raw) return undefined;

  const legacy = raw as CommercialResultsPresetConfigLegacy;

  const normalized = {
    ...raw,
  } as Record<string, unknown>;

  for (const key of COMMERCIAL_RESULTS_SCALAR_FILTER_KEYS) {
    if (key in raw) {
      normalized[key] = restoreCommercialResultsScalar(
        (raw as Record<string, unknown>)[key],
      );
    }
  }

  return {
    ...normalized,
    pack_type: restoreCommercialResultsScalar(raw.pack_type ?? legacy.packType),
    non_alcoholic: restoreCommercialResultsScalar(
      raw.non_alcoholic ?? legacy.nonAlcoholic,
    ),
    growth_levers: restoreCommercialResultsScalar(
      raw.growth_levers ?? legacy.growthLevers,
    ),
    beer_price_segment: restoreCommercialResultsScalar(
      raw.beer_price_segment ?? legacy.beerPriceSegment,
    ),
  } as CommercialResultsPresetConfig;
}

/** Ignore comma whitespace lost by the generic query coercion. */
function normalizeCommercialResultsComparisonValue(value: unknown): string {
  return String(value ?? "")
    .split(",")
    .map((part) => part.trim())
    .join(",");
}

const COMMERCIAL_ROW_DRIVER_TO_RAW_ROW_KEY = {
  brand: "brand",
  channel: "channel",
  region: "region",
  pack_type: "pack_type",
  category: "category",
  non_alcoholic: "non_alc_beer",
  growth_levers: "growth_levers",
  beer_price_segment: "beer_price_segment",
  portfolios: "portfolio",
} as const satisfies Partial<
  Record<
    keyof CommercialResultsPresetConfig,
    keyof CommercialResultsFilterRawRow
  >
>;

const COMMERCIAL_ROW_DRIVER_KEYS = Object.keys(
  COMMERCIAL_ROW_DRIVER_TO_RAW_ROW_KEY,
) as Array<keyof typeof COMMERCIAL_ROW_DRIVER_TO_RAW_ROW_KEY>;

type CommercialRowDriverKey = (typeof COMMERCIAL_ROW_DRIVER_KEYS)[number];

export type FilterRowsByActiveDriversOptions = {
  skipKeys?: CommercialRowDriverKey[];
};

/**
 * Filters raw SP rows by active preset drivers (ignores All / empty values).
 *
 * V2 query keys do not always match their stored-procedure row keys
 * (`non_alcoholic` -> `non_alc_beer`, `portfolios` -> `portfolio`), so the
 * explicit map above is the single source of truth for both groups.
 */
export function filterRowsByActiveDrivers(
  rows: CommercialResultsFilterRawRow[],
  cfg: CommercialResultsPresetConfig | undefined,
  options?: FilterRowsByActiveDriversOptions,
): CommercialResultsFilterRawRow[] {
  if (!cfg) return rows;

  const skip = new Set(options?.skipKeys ?? []);

  return rows.filter((row) => {
    for (const key of COMMERCIAL_ROW_DRIVER_KEYS) {
      if (skip.has(key)) continue;
      const driverValue = cfg[key];
      if (isCommercialResultsDimensionAll(driverValue)) continue;
      const rowKey = COMMERCIAL_ROW_DRIVER_TO_RAW_ROW_KEY[key];
      if (
        normalizeCommercialResultsComparisonValue(row[rowKey]) !==
        normalizeCommercialResultsComparisonValue(driverValue)
      ) {
        return false;
      }
    }
    return true;
  });
}
