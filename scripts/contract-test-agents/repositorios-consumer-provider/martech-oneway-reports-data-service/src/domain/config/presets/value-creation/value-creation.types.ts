/**
 * Raw row shape returned by the `owr_result_query_sp` stored procedure for
 * {@link VALUE_CREATION_FILTER_SP_NAME} / Drupal
 * `fetchValueCreationFilterData` dataset.
 *
 * The procedure returns lowercase column names; the handler reads them
 * case-insensitively.
 */
export interface ValueCreationFilterRawRow {
  ABI_ZONE: string;
  RAW_GEOGRAPHY: string;
  COUNTRY_ISO_CODE_3: string;
  GROWTHLEVER: string;
}

export interface ValueCreationGrowthLeverOption {
  label: string;
  value: string;
  disabled: boolean;
}

/**
 * Per-country entry under a zone bucket — mirrors Drupal ValueCreation
 * `extractCountries` payload.
 */
export interface ValueCreationCountryEntry {
  value: string;
  label: string;
  quick_filter_label: string;
  zone: string;
  growth_levers: ValueCreationGrowthLeverOption[];
  image_url: string;
}

export interface ValueCreationZoneOption {
  full: string;
  label: string;
  value: string;
  image_url: string;
}

export interface ValueCreationPeriodOption {
  value: string;
  label: string;
  full: string;
}

export interface ValueCreationCountryDimension {
  default: ValueCreationCountryEntry | Record<string, never>;
  values: Record<string, ValueCreationCountryEntry[]>;
}

export interface ValueCreationZonesDimension {
  default: ValueCreationZoneOption | Record<string, never>;
  values: ValueCreationZoneOption[];
}

export interface ValueCreationPeriodsDimension {
  default: ValueCreationPeriodOption | Record<string, never>;
  values: ValueCreationPeriodOption[];
}

/**
 * Serialized shape matches Drupal `PerformanceToolDto` / `ValueCreation::getValues`.
 */
export interface ValueCreationFilterPresetValue {
  country: ValueCreationCountryDimension;
  zones: ValueCreationZonesDimension;
  periods: ValueCreationPeriodsDimension;
}

export const VALUE_CREATION_DATASET_ID = "value-creation";

export const VALUE_CREATION_FILTER_SP_NAME = "7_value_creation_home_filter";
