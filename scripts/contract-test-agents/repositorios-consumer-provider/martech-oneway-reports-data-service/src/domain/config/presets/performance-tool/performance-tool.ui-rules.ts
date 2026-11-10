/**
 * Port of Drupal `PerformanceToolUiRules`.
 */
import {
  ALL_BRANDS,
  BEER_PRICE_SEGMENT,
  BEYOND_BEER,
  BALANCED_CHOICES,
  GLOBAL_BRANDS,
  LEAD_PREMIUM,
  PORTFOLIO,
  POWER_KPI,
  SUPERIOR_CORE,
  VOLUME_KPI,
  MARKET_SHARE_OFFICIAL_KPI,
  MARKET_SHARE_KPI,
} from "@domain/config/presets/performance-tool/performance-tool.constants";

export const VALUE_ALL = "All";
export const SOURCE_GLOBAL_BRANDS = "@global_brands";

const KPI_DEFAULTS: Record<string, Record<string, string>> = {
  [POWER_KPI]: {
    [ALL_BRANDS]: VALUE_ALL,
    [PORTFOLIO]: VALUE_ALL,
  },
  [VOLUME_KPI]: {
    [ALL_BRANDS]: SOURCE_GLOBAL_BRANDS,
    [PORTFOLIO]: VALUE_ALL,
    [BEER_PRICE_SEGMENT]: VALUE_ALL,
    [GLOBAL_BRANDS]: SOURCE_GLOBAL_BRANDS,
  },
  [MARKET_SHARE_KPI]: {
    [ALL_BRANDS]: VALUE_ALL,
  },
  [MARKET_SHARE_OFFICIAL_KPI]: {
    [ALL_BRANDS]: VALUE_ALL,
    [PORTFOLIO]: VALUE_ALL,
    [BEER_PRICE_SEGMENT]: VALUE_ALL,
    [GLOBAL_BRANDS]: SOURCE_GLOBAL_BRANDS,
  },
};

const GL_RULES: Record<
  string,
  Record<
    string,
    { global_default?: string; eur_default?: string } | Record<string, never>
  >
> = {
  [LEAD_PREMIUM]: {
    [ALL_BRANDS]: {
      global_default: SOURCE_GLOBAL_BRANDS,
      eur_default: VALUE_ALL,
    },
    [PORTFOLIO]: { global_default: VALUE_ALL },
    [BEER_PRICE_SEGMENT]: { global_default: VALUE_ALL },
    [GLOBAL_BRANDS]: {},
  },
  [SUPERIOR_CORE]: {
    [ALL_BRANDS]: { global_default: VALUE_ALL, eur_default: VALUE_ALL },
    [PORTFOLIO]: { global_default: VALUE_ALL },
    [BEER_PRICE_SEGMENT]: { global_default: VALUE_ALL },
  },
  [BALANCED_CHOICES]: {
    [ALL_BRANDS]: { global_default: VALUE_ALL, eur_default: VALUE_ALL },
    [PORTFOLIO]: { global_default: VALUE_ALL },
    [BEER_PRICE_SEGMENT]: { global_default: VALUE_ALL },
  },
  [BEYOND_BEER]: {
    [ALL_BRANDS]: { global_default: VALUE_ALL, eur_default: VALUE_ALL },
    [PORTFOLIO]: { global_default: VALUE_ALL },
  },
};

export function getGlobalDefault(
  kpi: string,
  classification: string,
  gl: string | null,
): string | null {
  if (gl !== null && kpi === VOLUME_KPI) {
    const rule = GL_RULES[gl]?.[classification];
    if (rule && "global_default" in rule) {
      return rule.global_default ?? null;
    }
    return null;
  }
  return KPI_DEFAULTS[kpi]?.[classification] ?? null;
}

export function getGlRules(gl: string): Record<string, unknown> {
  return GL_RULES[gl] ?? {};
}

export function isGlClassificationAvailable(
  gl: string,
  classification: string,
): boolean {
  return classification in (GL_RULES[gl] ?? {});
}
