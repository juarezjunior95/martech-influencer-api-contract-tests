import type {
  PerformanceToolWaterfallOptionsByScope,
  PerformanceToolWaterfallScopeBlock,
  PerformanceToolWaterfallTuple,
} from "@domain/config/presets/performance-tool-waterfall-options/performance-tool-waterfall-options.types";

const t = (label: string, value: string): PerformanceToolWaterfallTuple => ({
  label,
  value,
});

const block = (
  values: PerformanceToolWaterfallTuple[],
  defaultTuple: PerformanceToolWaterfallTuple,
): PerformanceToolWaterfallScopeBlock => ({ values, default: defaultTuple });

const OPTIONS_VOLUME: PerformanceToolWaterfallOptionsByScope = {
  global: block(
    [
      t("Portfolio", "portfolio"),
      t("Beer Price Segment", "beer_price_segment"),
      t("Brand", "brand"),
      t("Country", "country"),
    ],
    t("Portfolio", "portfolio"),
  ),
  portfolio: block(
    [t("Brand", "brand"), t("Country", "country")],
    t("Brand", "brand"),
  ),
  beer_price_segment: block(
    [t("Brand", "brand"), t("Country", "country")],
    t("Brand", "brand"),
  ),
  brand: block(
    [t("Country", "country"), t("Sub-Brand", "sub_brand")],
    t("Country", "country"),
  ),
  country: block(
    [
      t("Brand", "brand"),
      t("Beer Price Segment", "beer_price_segment"),
      t("Portfolio", "portfolio"),
    ],
    t("Brand", "brand"),
  ),
  beyond_beer_global: block(
    [t("Portfolio", "portfolio"), t("Brand", "brand"), t("Country", "country")],
    t("Portfolio", "portfolio"),
  ),
  beyond_beer_country: block(
    [t("Portfolio", "portfolio"), t("Brand", "brand")],
    t("Portfolio", "portfolio"),
  ),
};

const OPTIONS_POWER: PerformanceToolWaterfallOptionsByScope = {
  global: block(
    [t("Country", "country"), t("Portfolio", "portfolio")],
    t("Country", "country"),
  ),
  country: block(
    [t("Brand", "brand"), t("Portfolio", "portfolio"), t("Region", "region")],
    t("Brand", "brand"),
  ),
  region: block(
    [t("Brand", "brand"), t("Portfolio", "portfolio"), t("Drivers", "drivers")],
    t("Brand", "brand"),
  ),
  portfolio: block([t("Brand", "brand")], t("Brand", "brand")),
};

const OPTIONS_MARKET_SHARE: PerformanceToolWaterfallOptionsByScope = {
  global: block([t("Country", "country")], t("Country", "country")),
  brand: block(
    [t("Country", "country"), t("Sub-Brand", "sub_brand")],
    t("Country", "country"),
  ),
  country: block([t("Brand", "brand")], t("Brand", "brand")),
  eur_zone: block([t("Brand", "brand")], t("Brand", "brand")),
};

/**
 * Official Market Share (v2) — Data waterfall_filter dimensions:
 */
const OPTIONS_MARKET_SHARE_V2: PerformanceToolWaterfallOptionsByScope = {
  global: block(
    [
      t("Country", "country"),
      t("Beer Price Segment", "beer_price_segment"),
      t("Brand", "brand"),
    ],
    t("Country", "country"),
  ),
  beer_price_segment: block([t("Brand", "brand")], t("Brand", "brand")),
  brand: block([t("Sub-Brand", "sub_brand")], t("Sub-Brand", "sub_brand")),
  country: block(
    [t("Beer Price Segment", "beer_price_segment"), t("Brand", "brand")],
    t("Brand", "brand"),
  ),
  eur_zone: block([t("Brand", "brand")], t("Brand", "brand")),
};

const KPI_VOLUME = "volume";
const KPI_POWER = "power";
const KPI_NR = "nr";
const KPI_CORES = "cores";
const KPI_MARKET_SHARE = "market_share";
const KPI_MARKET_SHARE_OFFICIAL = "market_share_official";

const OPTIONS_BY_KPI: Record<string, PerformanceToolWaterfallOptionsByScope> = {
  [KPI_VOLUME]: OPTIONS_VOLUME,
  [KPI_POWER]: OPTIONS_POWER,
  [KPI_NR]: OPTIONS_VOLUME,
  [KPI_CORES]: OPTIONS_VOLUME,
  [KPI_MARKET_SHARE]: OPTIONS_MARKET_SHARE,
  [KPI_MARKET_SHARE_OFFICIAL]: OPTIONS_MARKET_SHARE_V2,
};

function cloneScopeMap(
  source: PerformanceToolWaterfallOptionsByScope,
): PerformanceToolWaterfallOptionsByScope {
  const out: PerformanceToolWaterfallOptionsByScope = {};
  for (const [scope, entry] of Object.entries(source)) {
    out[scope] = {
      values: entry.values.map((row) => ({ ...row })),
      default: { ...entry.default },
    };
  }
  return out;
}

/**
 * Waterfall drill-down options for a Performance Tool KPI, keyed by current scope
 * (e.g. `global`, `country`). Each scope lists allowed next waterfall dimensions
 * and its default selection.
 */
export function getPerformanceToolWaterfallOptionsByKpi(
  kpi: string,
): PerformanceToolWaterfallOptionsByScope {
  const key = kpi.trim().toLowerCase();
  const table = OPTIONS_BY_KPI[key];
  if (!table) {
    return {};
  }
  return cloneScopeMap(table);
}

export function firstScopeBlock(
  map: PerformanceToolWaterfallOptionsByScope,
): PerformanceToolWaterfallScopeBlock | undefined {
  const firstKey = Object.keys(map)[0];
  if (firstKey === undefined) {
    return undefined;
  }
  const entry = map[firstKey];
  if (!entry) {
    return undefined;
  }
  return {
    values: entry.values.map((row) => ({ ...row })),
    default: { ...entry.default },
  };
}
