import type {
  InnovationHubWaterfallOptionsByScope,
  InnovationHubWaterfallScopeBlock,
  InnovationHubWaterfallTuple,
} from "@domain/config/presets/innovation-hub-waterfall-options/innovation-hub-waterfall-options.types";

const t = (label: string, value: string): InnovationHubWaterfallTuple => ({
  label,
  value,
});

const block = (
  values: InnovationHubWaterfallTuple[],
  defaultTuple: InnovationHubWaterfallTuple,
): InnovationHubWaterfallScopeBlock => ({ values, default: defaultTuple });

const OPTIONS_INNOVATION_HUB: InnovationHubWaterfallOptionsByScope = {
  global: block(
    [t("Brand", "brand"), t("Country", "country")],
    t("Country", "country"),
  ),
  country: block([t("Brand", "brand")], t("Brand", "brand")),
  brand: block([t("SKU", "sku")], t("SKU", "sku")),
};

const KPI_VOLUME = "volume";
const KPI_NR = "nr";
const KPI_MACO = "maco";
const KPI_MACO_MARGIN = "maco_margin";

const OPTIONS_BY_KPI: Record<string, InnovationHubWaterfallOptionsByScope> = {
  [KPI_VOLUME]: OPTIONS_INNOVATION_HUB,
  [KPI_NR]: OPTIONS_INNOVATION_HUB,
  [KPI_MACO]: OPTIONS_INNOVATION_HUB,
  [KPI_MACO_MARGIN]: OPTIONS_INNOVATION_HUB,
};

function cloneScopeMap(
  source: InnovationHubWaterfallOptionsByScope,
): InnovationHubWaterfallOptionsByScope {
  const out: InnovationHubWaterfallOptionsByScope = {};
  for (const [scope, entry] of Object.entries(source)) {
    out[scope] = {
      values: entry.values.map((row) => ({ ...row })),
      default: { ...entry.default },
    };
  }
  return out;
}

export function getInnovationHubWaterfallOptionsByKpi(
  kpi: string,
): InnovationHubWaterfallOptionsByScope {
  const key = kpi.trim().toLowerCase();
  const table = OPTIONS_BY_KPI[key];
  if (!table) {
    return {};
  }
  return cloneScopeMap(table);
}

export function firstInnovationHubScopeBlock(
  map: InnovationHubWaterfallOptionsByScope,
): InnovationHubWaterfallScopeBlock | undefined {
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
