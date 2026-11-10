export interface PosToolDrilldownTuple {
  value: string;
  label: string;
  /**
   * Legacy fields used by most "toDimension()" builders in this preset.
   *
   * Some sibling presets (e.g. `country`/`zone` from their dedicated
   * handlers) don't emit `full` and instead provide
   * `quick_filter_label` and `image_url`.
   */
  full?: string;
  /**
   * For `region` tuples: deduped list of countries that belong to this region.
   */
  country?: string[];
  quick_filter_label?: string;
  image_url?: string;
}

export interface PosToolDrilldownGroupedValues {
  group: string;
  values: PosToolDrilldownTuple[];
}

export interface PosToolDrilldownDimension {
  enabled: boolean;
  default: PosToolDrilldownTuple | Record<string, never>;
  values: PosToolDrilldownTuple[];
}

export interface PosToolDrilldownCountryTuple extends PosToolDrilldownTuple {
  zone: string;
  regions?: string[];
}

export interface PosToolDrilldownCountryDimension {
  enabled: boolean;
  default: PosToolDrilldownTuple | Record<string, never>;
  values: Record<string, PosToolDrilldownCountryTuple[]>;
}

export interface PosToolDrilldownBrandTuple extends PosToolDrilldownTuple {
  countries: string[];
  regions: string[];
  manufacturers: string[];
  categories: string[];
  Portfolio: Record<string, string>;
  "Growth Levers": Record<string, string>;
}

export interface PosToolDrilldownBrandDimension {
  enabled: boolean;
  default: PosToolDrilldownTuple | Record<string, never>;
  values: PosToolDrilldownBrandTuple[];
}

export interface PosToolDrilldownGroupedDimension {
  enabled: boolean;
  default:
    | PosToolDrilldownTuple
    | PosToolDrilldownTuple[]
    | Record<string, never>;
  values: PosToolDrilldownGroupedValues[];
}

export interface PosToolDrilldownRuleCondition {
  values: string[];
  condition_type: "eq" | "in" | "neq" | "nin";
  apply_to: string[];
}

export interface PosToolDrilldownFilterRuleItem {
  enable_rules: Record<string, PosToolDrilldownRuleCondition>;
  disable_rules: Record<string, PosToolDrilldownRuleCondition>;
}

export interface PosToolDrilldownFilterRulesValue {
  filters: Record<string, PosToolDrilldownFilterRuleItem>;
}

export interface PosToolDrilldownPresetValue {
  viewby: PosToolDrilldownDimension;
  country: PosToolDrilldownCountryDimension;
  zone: PosToolDrilldownDimension;
  region: PosToolDrilldownDimension;
  timeframe: PosToolDrilldownDimension;
  category: PosToolDrilldownDimension;
  manufacturer: PosToolDrilldownDimension;
  cohort: PosToolDrilldownGroupedDimension;
  brand_segments: PosToolDrilldownGroupedDimension;
  kpi: PosToolDrilldownGroupedDimension;
  brand: PosToolDrilldownBrandDimension;
  filter_rules: PosToolDrilldownFilterRulesValue;
}

/** Raw row from `1_category_home_filters` (all columns are strings). */
export interface PosToolDrilldownRawRow {
  country?: string;
  zone?: string;
  region?: string;
  category?: string;
  brand?: string;
  manufacturer?: string;
  portfolio?: string;
  growth_lever?: string;
  [key: string]: string | undefined;
}
