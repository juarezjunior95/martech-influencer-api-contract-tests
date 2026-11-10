/**
 * Port of Drupal `PerformanceToolConstants` — static KPI config and column keys.
 */
export const POWER_KPI = "power";
export const VOLUME_KPI = "volume";
export const NR_KPI = "nr";
export const MARKET_SHARE_KPI = "market_share";
export const MARKET_SHARE_OFFICIAL_KPI = "market_share_official";
export const CORES_KPI = "cores";

export const QUARTERLY = "quarterly";
export const MONTHLY = "monthly";

export const ALL_BRANDS = "All Brands";
export const PORTFOLIO = "Portfolio";
export const BEER_PRICE_SEGMENT = "Beer Price Segment";
export const GLOBAL_BRANDS = "Global Brands";

export const SUPERIOR_CORE = "Superior Core";
export const LEAD_PREMIUM = "Lead Premium";
export const BALANCED_CHOICES = "Balanced Choices";
export const BEYOND_BEER = "Beyond Beer";

export const PORTFOLIO_ORDER = [
  "Megabrands",
  "Expansion",
  "Sustain",
  "Tail",
] as const;

export const WEIGHT_TYPE_OPTIONS = [
  { label: "Budget", value: "bu" },
  { label: "Industry", value: "ind" },
];
export const KPIS_MAPPING: Record<
  string,
  {
    label: string;
    value: string;
    periods: readonly string[];
    group: string;
    brands_classification: string[];
    growth_levers_classification: string[];
    cloneOf?: string;
    weight_type?: { label: string; value: string }[];
    timePeriod?: boolean;
  }
> = {
  [VOLUME_KPI]: {
    label: "Volume",
    value: "VOLUME",
    periods: [MONTHLY],
    group: "volume",
    brands_classification: [
      ALL_BRANDS,
      PORTFOLIO,
      BEER_PRICE_SEGMENT,
      GLOBAL_BRANDS,
    ],
    growth_levers_classification: [
      SUPERIOR_CORE,
      LEAD_PREMIUM,
      BALANCED_CHOICES,
      BEYOND_BEER,
    ],
    timePeriod: true,
  },
  [NR_KPI]: {
    label: "Net Revenue",
    value: "NR",
    periods: [MONTHLY],
    group: "finance",
    brands_classification: [],
    growth_levers_classification: [],
    cloneOf: VOLUME_KPI,
    timePeriod: true,
  },
  [CORES_KPI]: {
    label: "CORES",
    value: "CORES",
    periods: [MONTHLY],
    group: "finance",
    brands_classification: [],
    growth_levers_classification: [],
    cloneOf: VOLUME_KPI,
    timePeriod: true,
  },
  [MARKET_SHARE_KPI]: {
    label: "Market Share",
    value: "MARKET_SHARE",
    periods: [MONTHLY],
    group: "market_share",
    brands_classification: [ALL_BRANDS],
    growth_levers_classification: [],
  },
  [MARKET_SHARE_OFFICIAL_KPI]: {
    label: "Market Share Official",
    value: "MARKET_SHARE_OFFICIAL",
    periods: [MONTHLY],
    group: "market_share_official_total",
    brands_classification: [
      ALL_BRANDS,
      PORTFOLIO,
      BEER_PRICE_SEGMENT,
      GLOBAL_BRANDS,
    ],
    weight_type: WEIGHT_TYPE_OPTIONS,
    growth_levers_classification: [SUPERIOR_CORE, LEAD_PREMIUM],
    timePeriod: true,
  },
  [POWER_KPI]: {
    label: "Brand Power",
    value: "POWER",
    periods: [QUARTERLY],
    group: "power",
    brands_classification: [ALL_BRANDS, PORTFOLIO],
    growth_levers_classification: [],
  },
};

export const GROWTH_LEVERS_KPIS = [
  VOLUME_KPI,
  MARKET_SHARE_OFFICIAL_KPI,
] as const;

export const ZONE_GLOBAL = "ABI";
export const ZONE_EUR = "EUR";
export const ZONE_MAPPING: Record<string, { label: string; value: string }> = {
  [ZONE_GLOBAL]: { label: "Global", value: ZONE_GLOBAL },
};

export const COUNTRY_GLOBAL = "ABI";
export const COUNTRY_EUR = "EUR";
export const COUNTRY_MAPPING: Record<
  string,
  {
    label: string;
    quick_filter_label: string;
    zone: string;
    value: string;
  }
> = {
  [COUNTRY_GLOBAL]: {
    label: "All",
    quick_filter_label: "Global",
    zone: ZONE_GLOBAL,
    value: COUNTRY_GLOBAL,
  },
  [COUNTRY_EUR]: {
    label: "All",
    quick_filter_label: "Europe",
    zone: ZONE_EUR,
    value: COUNTRY_GLOBAL,
  },
};

export const COL_KPI_NAME = "KPI_NAME";
export const COL_ZONE = "ABI_ZONE";
export const COL_COUNTRY_ISO = "COUNTRY_ISO_CODE_3";
export const COL_COUNTRY_NAME = "RAW_GEOGRAPHY";
export const COL_BRAND = "RAW_BRAND";
export const COL_SEGMENT = "SEGMENT";
export const COL_PERIOD = "PERIOD";
export const COL_SUBBRAND = "SUBBRAND";
export const COL_GROWTH_LEVER = "GROWTHLEVER";
export const COL_GLOBAL_BRAND = "GLOBALBRAND";
export const COL_PRICE_TIER = "PRICE_TIER";

export const COL_REGION = "REGION";
export const REGION_RESIDUAL = "residual";
export const isResidualRegion = (region: string): boolean =>
  region.trim().toLowerCase() === REGION_RESIDUAL;
export const REGION_PLACEHOLDER = { value: "All", label: "Select a Region" };

/** Same order as Drupal `PerformanceTool::KPIS_ENABLED`. */
export const KPIS_ENABLED = [
  VOLUME_KPI,
  POWER_KPI,
  NR_KPI,
  CORES_KPI,
  MARKET_SHARE_KPI,
  MARKET_SHARE_OFFICIAL_KPI,
] as const;
