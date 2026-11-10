import type {
  CommercialResultsWaterfallOptionsByScope,
  CommercialResultsWaterfallScopeBlock,
  CommercialResultsWaterfallTuple,
} from "@domain/config/presets/commercial-results-waterfall-options/commercial-results-waterfall-options.types";

const t = (label: string, value: string): CommercialResultsWaterfallTuple => ({
  label,
  value,
});

const block = (
  values: CommercialResultsWaterfallTuple[],
  defaultTuple: CommercialResultsWaterfallTuple,
): CommercialResultsWaterfallScopeBlock => ({ values, default: defaultTuple });

const BASE_OPTIONS: CommercialResultsWaterfallTuple[] = [
  t("Region", "region"),
  t("Channel", "channel"),
  t("Brand", "brand"),
  t("Pack Type", "pack_type"),
];

const DEFAULT_OPTION = t("Region", "region");

/**
 * Drill-down dimensions offered per scope. Volume and Net Revenue intentionally
 * share the same set — the KPI changes the measure, not the dimensions you can
 * break it down by. Split this into per-KPI tables if that ever stops holding.
 */
const SCOPE_OPTIONS_BASE: CommercialResultsWaterfallOptionsByScope = {
  global: block(BASE_OPTIONS, DEFAULT_OPTION),
  brand: block([...BASE_OPTIONS, t("Sub-Brand", "sub_brand")], DEFAULT_OPTION),
  sub_brand: block(
    [...BASE_OPTIONS, t("Sub-Brand", "sub_brand"), t("SKU", "sku")],
    DEFAULT_OPTION,
  ),
};

const KPI_VOLUME = "volume";
const KPI_NET_REVENUE = "nr";

const OPTIONS_BY_KPI: Record<string, CommercialResultsWaterfallOptionsByScope> =
  {
    [KPI_VOLUME]: SCOPE_OPTIONS_BASE,
    [KPI_NET_REVENUE]: SCOPE_OPTIONS_BASE,
  };

function cloneScopeMap(
  source: CommercialResultsWaterfallOptionsByScope,
): CommercialResultsWaterfallOptionsByScope {
  const out: CommercialResultsWaterfallOptionsByScope = {};
  for (const [scope, entry] of Object.entries(source)) {
    out[scope] = {
      values: entry.values.map((row) => ({ ...row })),
      default: { ...entry.default },
    };
  }
  return out;
}

/**
 * Waterfall drill-down options for a Commercial Results KPI, keyed by current scope
 * (e.g. `global`, `brand`, `sub_brand`). Each scope lists allowed waterfall dimensions
 * and its default selection.
 */
export function getCommercialResultsWaterfallOptionsByKpi(
  kpi: string,
): CommercialResultsWaterfallOptionsByScope {
  const key = kpi.trim().toLowerCase();
  const table = OPTIONS_BY_KPI[key];
  if (!table) {
    return {};
  }
  return cloneScopeMap(table);
}

export function firstScopeBlock(
  map: CommercialResultsWaterfallOptionsByScope,
): CommercialResultsWaterfallScopeBlock | undefined {
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
