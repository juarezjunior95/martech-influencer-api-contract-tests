import { PosToolDrilldownTuple } from "@domain/config/presets/category/pos-tool-drilldown/pos-tool-drilldown.types";

export const POS_TOOL_DRILLDOWN_PORTFOLIO_MEGABRAND = "Megabrands";
export const POS_TOOL_DRILLDOWN_PORTFOLIO_EXPANSION = "Expansion";
export const POS_TOOL_DRILLDOWN_PORTFOLIO_SUSTAIN = "Sustain";
export const POS_TOOL_DRILLDOWN_PORTFOLIO_TAIL = "Tail";

export const POS_TOOL_DRILLDOWN_PORTFOLIO: PosToolDrilldownTuple[] = [
  {
    value: POS_TOOL_DRILLDOWN_PORTFOLIO_MEGABRAND,
    label: POS_TOOL_DRILLDOWN_PORTFOLIO_MEGABRAND,
    full: "",
  },
  {
    value: POS_TOOL_DRILLDOWN_PORTFOLIO_EXPANSION,
    label: POS_TOOL_DRILLDOWN_PORTFOLIO_EXPANSION,
    full: "",
  },
  {
    value: POS_TOOL_DRILLDOWN_PORTFOLIO_SUSTAIN,
    label: POS_TOOL_DRILLDOWN_PORTFOLIO_SUSTAIN,
    full: "",
  },
  {
    value: POS_TOOL_DRILLDOWN_PORTFOLIO_TAIL,
    label: POS_TOOL_DRILLDOWN_PORTFOLIO_TAIL,
    full: "",
  },
];

export const POS_TOOL_DRILLDOWN_PORTFOLIO_ORDER =
  POS_TOOL_DRILLDOWN_PORTFOLIO.map((row) => row.value);

const PORTFOLIO_ALIASES: Record<string, string> = {
  "mega brand": POS_TOOL_DRILLDOWN_PORTFOLIO_MEGABRAND,
  megabrand: POS_TOOL_DRILLDOWN_PORTFOLIO_MEGABRAND,
  megabrands: POS_TOOL_DRILLDOWN_PORTFOLIO_MEGABRAND,
  "expansion brand": POS_TOOL_DRILLDOWN_PORTFOLIO_EXPANSION,
  expansion: POS_TOOL_DRILLDOWN_PORTFOLIO_EXPANSION,
  "sustain brand": POS_TOOL_DRILLDOWN_PORTFOLIO_SUSTAIN,
  sustain: POS_TOOL_DRILLDOWN_PORTFOLIO_SUSTAIN,
  "tail brand": POS_TOOL_DRILLDOWN_PORTFOLIO_TAIL,
  tail: POS_TOOL_DRILLDOWN_PORTFOLIO_TAIL,
};

export function normalizePosToolDrilldownPortfolio(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const canonical = PORTFOLIO_ALIASES[trimmed.toLowerCase()];
  if (canonical) {
    return canonical;
  }

  return trimmed;
}

export const POS_TOOL_DRILLDOWN_GROWTH_LEVER_CORE_CO = "Core Co";
export const POS_TOOL_DRILLDOWN_GROWTH_LEVER_PREMIUM_CO = "Premium Co";
export const POS_TOOL_DRILLDOWN_GROWTH_LEVER_BEYOND_BEER = "Beyond Beer";
export const POS_TOOL_DRILLDOWN_GROWTH_LEVER_NAB = "NAB";

export const POS_TOOL_DRILLDOWN_GROWTH_LEVERS: PosToolDrilldownTuple[] = [
  {
    value: POS_TOOL_DRILLDOWN_GROWTH_LEVER_CORE_CO,
    label: POS_TOOL_DRILLDOWN_GROWTH_LEVER_CORE_CO,
    full: POS_TOOL_DRILLDOWN_GROWTH_LEVER_CORE_CO,
  },
  {
    value: POS_TOOL_DRILLDOWN_GROWTH_LEVER_PREMIUM_CO,
    label: POS_TOOL_DRILLDOWN_GROWTH_LEVER_PREMIUM_CO,
    full: POS_TOOL_DRILLDOWN_GROWTH_LEVER_PREMIUM_CO,
  },
  {
    value: POS_TOOL_DRILLDOWN_GROWTH_LEVER_BEYOND_BEER,
    label: POS_TOOL_DRILLDOWN_GROWTH_LEVER_BEYOND_BEER,
    full: POS_TOOL_DRILLDOWN_GROWTH_LEVER_BEYOND_BEER,
  },
  {
    value: POS_TOOL_DRILLDOWN_GROWTH_LEVER_NAB,
    label: POS_TOOL_DRILLDOWN_GROWTH_LEVER_NAB,
    full: "Non-Alcoholic Beer",
  },
];

export const POS_TOOL_DRILLDOWN_GROWTH_LEVERS_ORDER =
  POS_TOOL_DRILLDOWN_GROWTH_LEVERS.map((row) => row.value);

const GROWTH_LEVER_ALIASES: Record<string, string> = {
  "superior core": POS_TOOL_DRILLDOWN_GROWTH_LEVER_CORE_CO,
  "core co": POS_TOOL_DRILLDOWN_GROWTH_LEVER_CORE_CO,
  "lead premium": POS_TOOL_DRILLDOWN_GROWTH_LEVER_PREMIUM_CO,
  "premium co": POS_TOOL_DRILLDOWN_GROWTH_LEVER_PREMIUM_CO,
  "beyond beer": POS_TOOL_DRILLDOWN_GROWTH_LEVER_BEYOND_BEER,
  "balanced choices": POS_TOOL_DRILLDOWN_GROWTH_LEVER_NAB,
  nab: POS_TOOL_DRILLDOWN_GROWTH_LEVER_NAB,
  "non-alcoholic beer": POS_TOOL_DRILLDOWN_GROWTH_LEVER_NAB,
  "non alcohol beer": POS_TOOL_DRILLDOWN_GROWTH_LEVER_NAB,
};

export function normalizePosToolDrilldownGrowthLever(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const canonical = GROWTH_LEVER_ALIASES[trimmed.toLowerCase()];
  if (canonical) {
    return canonical;
  }

  return trimmed;
}

export const POS_TOOL_DRILLDOWN_CATEGORY_BEER_BEYOND_BEER =
  "Beer + Beyond Beer";

const CATEGORY_LABEL_ALIASES: Record<string, string> = {
  "beer + bb": POS_TOOL_DRILLDOWN_CATEGORY_BEER_BEYOND_BEER,
  "beer + byb": POS_TOOL_DRILLDOWN_CATEGORY_BEER_BEYOND_BEER,
  "beer + beyond beer": POS_TOOL_DRILLDOWN_CATEGORY_BEER_BEYOND_BEER,
};

export function resolvePosToolDrilldownCategoryLabel(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const alias = CATEGORY_LABEL_ALIASES[trimmed.toLowerCase()];
  if (alias) {
    return alias;
  }

  return trimmed;
}

export function normalizePosToolDrilldownCategoryValue(value: string): string {
  return resolvePosToolDrilldownCategoryLabel(value);
}

export function resolvePosToolDrilldownCategoryDedupKey(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const alias = CATEGORY_LABEL_ALIASES[trimmed.toLowerCase()];
  if (alias) {
    return "beer + bb";
  }

  return trimmed.toLowerCase();
}
