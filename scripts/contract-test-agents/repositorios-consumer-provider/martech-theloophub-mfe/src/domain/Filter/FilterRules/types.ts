export type FilterValue = string | number | null;

export interface Option {
  value: FilterValue;
  label: FilterValue;
}

export interface FilterRuleConfig {
  locked?: boolean; // Brand field completely locked/disabled
  brandLocked?: boolean; // Brand locked when classification = All
  notAvailable?: boolean; // Brand class not available
  allowed?: string[]; // Allowed values for classification
  source?: 'global_brands' | 'api'; // Source of brands data
  brandHidden?: boolean; // Hide brands field
  subBrandHidden?: boolean; // Hide sub_brands field
  noAllOption?: boolean; // Don't show "All" option
  defaultFirstAlphabetical?: boolean; // Default is first alphabetical value
}

export interface GeoRules {
  global: Record<string, FilterRuleConfig>;
  country: Record<string, FilterRuleConfig>;
  zone: Record<string, FilterRuleConfig>;
  eur?: Record<string, FilterRuleConfig>;
}

export interface FilterFieldConfig {
  disabled: boolean;
  hidden: boolean;
  allowedValues: string[] | null;
  defaultValue: string | null;
  label: string;
  placeholder?: string;
}

export interface FilterState {
  kpi: string;
  growthLever: string;
  country: string;
  zone: string;
  brandClass: string;
  brand: string;
  portfolio?: string;
  beerPriceSegment?: string;
}
