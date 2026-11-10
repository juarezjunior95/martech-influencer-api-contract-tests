import {
  BALANCED_CHOICES,
  BEYOND_BEER,
  LEAD_PREMIUM,
  PORTFOLIO_ORDER,
  SUPERIOR_CORE,
} from "@domain/config/presets/performance-tool/performance-tool.constants";
import type {
  CommercialResultsOption,
  CommercialResultsPeriodOption,
} from "./commercial-results.types";

export const COMMERCIAL_RESULTS_KPI_OPTIONS = [
  { value: "volume", label: "Volume" },
  { value: "nr", label: "Net Revenue" },
] as const satisfies readonly CommercialResultsOption[];

export const COMMERCIAL_RESULTS_DEFAULT_KPI = COMMERCIAL_RESULTS_KPI_OPTIONS[0];

export const COMMERCIAL_RESULTS_PERIOD_KPI_GROUPS = {
  volume: "sku_pnl",
  nr: "sku_pnl_nr",
} as const;

/** Desired display order for period values. */
export const PERIOD_ORDER = ["YTD", "L3M", "MTD"] as const;

/**
 * Maps raw period codes from the SP to their normalized equivalents.
 * The SP may return "MTH" for month-to-date; we normalize it to "MTD".
 */
export const PERIOD_NORMALIZATION: Record<string, string> = {
  MTH: "MTD",
};

/** Static period labels when the volume refresh date cannot be parsed. */
export const STATIC_PERIOD_OPTIONS: CommercialResultsPeriodOption[] = [
  { value: "YTD", label: "YTD", full: "Year To Date (YTD)" },
  { value: "L3M", label: "L3M", full: "Last 3 Months (L3M)" },
  { value: "MTD", label: "MTD", full: "Month To Date (MTD)" },
];

/** Sentinel value for unset filter dimensions. */
export const FILTER_PLACEHOLDER_VALUE = "All";

/** Documented Growth Levers values */
export const GROWTH_LEVERS_ALLOWED = [
  BALANCED_CHOICES,
  BEYOND_BEER,
  LEAD_PREMIUM,
  SUPERIOR_CORE,
] as const;

/** Documented Beer Price Segment values */
export const BEER_PRICE_SEGMENT_ALLOWED = [
  "Super Premium",
  "Premium",
  "Core+",
  "Core",
  "Value",
] as const;

/** Documented Portfolio values */
export const PORTFOLIOS_ALLOWED = PORTFOLIO_ORDER;

export const GROWTH_LEVERS_ALLOWED_SET = new Set<string>(GROWTH_LEVERS_ALLOWED);
export const BEER_PRICE_SEGMENT_ALLOWED_SET = new Set<string>(
  BEER_PRICE_SEGMENT_ALLOWED,
);
export const PORTFOLIOS_ALLOWED_SET = new Set<string>(PORTFOLIOS_ALLOWED);

function placeholderOption(label: string): CommercialResultsOption {
  return { value: FILTER_PLACEHOLDER_VALUE, label };
}

/** Default placeholder options keyed by filter dimension. */
export const FILTER_PLACEHOLDERS = {
  region: placeholderOption("Select a Region"),
  brand: placeholderOption("Select a Brand"),
  subBrand: placeholderOption("Select a Sub Brand"),
  subBrandNoBrand: placeholderOption("Select a Brand first"),
  sku: placeholderOption("Select a SKU"),
  skuNoBrand: placeholderOption("Select a Brand first"),
  channel: placeholderOption("Select a Channel"),
  packType: placeholderOption("Select a Pack type"),
  category: placeholderOption("Select a Category"),
  nonAlcoholic: placeholderOption("Select a Type"),
  growthLevers: placeholderOption("Select a Growth Levers"),
  beerPriceSegment: placeholderOption("Select a Segment"),
  portfolios: placeholderOption("Select a Portfolio"),
} as const satisfies Record<string, CommercialResultsOption>;

/**
 * Geographic affinity between zones. Used only for the last fallback: when
 * neither the user's country nor their whole zone exists in the KPI catalogue,
 * the default should land on a neighbouring market instead of wherever the zone
 * registry happens to declare first.
 */
export const ZONE_AFFINITY_GROUPS: readonly (readonly string[])[] = [
  ["MAZ", "NAZ", "SAZ"],
  ["EUR", "AFR"],
  ["APAC"],
];
