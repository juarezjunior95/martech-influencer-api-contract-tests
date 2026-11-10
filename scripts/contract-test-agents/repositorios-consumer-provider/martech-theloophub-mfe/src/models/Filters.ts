import { SegmentedControlOptions } from '@hexa-ui/components';
import { SelectOptions } from 'components/Form/components/Select/types';

export const ZONE_GLOBAL_KEY = 'ABI';
export const ZONE_GLOBAL_LABEL = 'Global';
export const COUNTRY_GLOBAL_KEY = 'ABI';
export const COUNTRY_GLOBAL_LABEL = 'All';
export const ALL_SUB_BRAND = 'All';
export const ALL_BRAND = 'All';

// ============================================================
// BASE TYPES
// ============================================================

/**
 * Filter loading status
 */
export type FilterStatus = 'idle' | 'loading' | 'loaded' | 'error';

export type BrandImageFormat = 'square' | 'table';

export interface FilterImageFields {
  image_url?: string;
  image_variants?: Record<string, string | null | undefined>;
}

export type Option = {
  value: FilterValue;
  label: FilterValue;
  full?: FilterValue;
  isDisabled?: boolean;
  icon?: React.FunctionComponent;
  zone?: string;
  quick_filter_label?: string;
} & FilterImageFields;

export type FilterOption = {
  group: string;
  values: Option[];
};

/**
 * Possible filter value types
 */
export type FilterValue = string | number | null;

/**
 * Generic filter options object
 */
export interface FilterOptions {
  [key: string]: FilterValue | FilterOptions;
}

/**
 * Filter form state - key-value pairs of filter values
 */
export interface FilterForm {
  [key: string]: FilterValue;
}

// ============================================================
// FILTER STRUCTURE TYPES
// ============================================================

/**
 * Standard filter structure with values, default and enabled flag
 */
export interface DefaultOptions {
  values: Option[];
  default: Option;
  enabled: boolean;
}

/**
 * Filter structure with grouped values (used by brands_abi, brands_comp)
 */
interface GroupedOptions {
  values: Record<string, SelectOptions>;
  default: Option;
  enabled: boolean;
}

/**
 * Country filter structure with values grouped by zone
 */
interface Country {
  values: Record<string, Option[]>;
  default: Option;
  enabled: boolean;
}

/**
 * Time frame filter structure with date range
 */
interface TimeFrame {
  values: { ini: string; end: string };
  default: { ini: string; end: string };
  enabled: boolean;
}

/**
 * YTD Month filter structure with segmented control options
 */
interface SegmentedControlFilter {
  values: SegmentedControlOptions[];
  default: Option;
  enabled: boolean;
}

// ============================================================
// BRANDS FILTER TYPES
// ============================================================

/**
 * Brand structure with sub-brands
 */
interface Brand {
  value: string;
  label: string;
  sub_brands: Option[];
  default: Option;
  image_url?: string;
  image_variants?: Record<string, string | null | undefined>;
}

/**
 * Brands filter structure with values grouped by country
 */
export interface Brands {
  values: Record<
    string,
    {
      brands: Brand[];
      default: Option;
    }
  >;
  default: Option;
  enabled: boolean;
}

/**
 * Global brands filter structure with values
 */
export interface GlobalBrands {
  default: Option;
  enabled: boolean;
  values: FilterOption[];
}

// ============================================================
// AUDIENCE TARGETING TYPES
// ============================================================

/**
 * Audience targeting brand competitor structure
 */
interface AudienceTargetingBrandsCompetitor {
  value: FilterValue;
  label: FilterValue;
  is_sub_brand?: boolean;
  image_url?: string;
  image_variants?: Option['image_variants'];
}

/**
 * Audience targeting brand value structure
 */
interface AudienceTargetingBrandsValue {
  value: FilterValue;
  label: FilterValue;
  is_sub_brand?: boolean;
  image_url?: string;
  image_variants?: Option['image_variants'];
  competitor?: AudienceTargetingBrandsCompetitor[];
}

/**
 * Audience targeting brands filter structure
 */
interface AudienceTargetingBrands {
  values: Record<string, AudienceTargetingBrandsValue[]>;
  default: Option;
  enabled: boolean;
}

// ============================================================
// FILTER DATA STRUCTURE
// ============================================================

/**
 * Complete filter data structure containing all possible filters
 * Each filter is optional and follows its specific structure
 */
export interface FilterDataStructure {
  zones?: DefaultOptions;
  country?: Country;
  years?: DefaultOptions;
  time_frame?: TimeFrame;
  'ytd-month'?: SegmentedControlFilter;
  brands?: Brands;
  sub_brands?: DefaultOptions;
  brands_abi?: GroupedOptions;
  brands_comp?: GroupedOptions;
  beer_price_segment?: DefaultOptions;
  growth_levers?: DefaultOptions;
  audience_targeting_brands?: AudienceTargetingBrands;
  kpis?: DefaultOptions;
  brand_filter_groupings?: DefaultOptions;
  brand_power_book_scopes?: DefaultOptions;
  global_brands?: GlobalBrands;
  segments?: DefaultOptions;
  portfolio?: DefaultOptions;
  portfolios?: DefaultOptions;
  periods?: DefaultOptions;
  pos_periods?: DefaultOptions;
  distribution_scopes?: DefaultOptions;
  product_scope?: DefaultOptions;
}

// ============================================================
// STATE TYPES
// ============================================================

export type PageName = string | null;

/**
 * Filter page state containing all filter-related data for a specific page
 */
export interface FilterPage {
  /** Current loading/loaded status */
  status: FilterStatus;
  /** Filter data structure from API */
  dataFilters: FilterDataStructure;
  /** Calculated default values */
  defaults: FilterForm;
  /** Resolved KPI for Performance Tool; when set, signals that page defaults have been initialized. */
  defaultKpi: string | null;
  /** Currently applied filter values */
  applied: FilterForm;
  /** Raw filter data structure from API */
  rawData: FilterDataStructure;
  /** Current form values (may differ from applied) */
  form: FilterForm;
  /** Timestamp of last update */
  lastUpdated: number;
  /** Whether the filter is hidden */
  isHidden: boolean;
}

/**
 * Root state for filters slice
 */
export interface FiltersState {
  pages: {
    [pageName: string]: FilterPage;
  };
  currentPage: PageName;
  previousPage: PageName;
}

// ============================================================
// ACTION PAYLOAD TYPES
// ============================================================

/**
 * Payload for loading filters
 */
export interface LoadFiltersParams {
  // BFF preset id. The thunk fetches `/v1/presets/{pageName}` via
  pageName: string;
}

/**
 * Response from loading filters
 */
export interface LoadFiltersResponse {
  /** Page name that was loaded */
  pageName: string;
  /** Whether the data was cached */
  cached?: boolean;
  /** Error message if loading failed */
  error?: string;
  /** Loaded filter data structure */
  dataFilters?: FilterDataStructure;
  /** Raw filter data structure from API */
  rawData?: any;
  /** Default KPI to be used for the page PerformanceTool */
  defaultKpi?: string;
}

/**
 * Payload for updating a form value
 */
export interface UpdateFormValuePayload {
  /** Filter key to update */
  key: string;
  /** New value for the filter */
  value: FilterValue;
}

export interface UpdateFormPayload {
  form: FilterForm;
}
