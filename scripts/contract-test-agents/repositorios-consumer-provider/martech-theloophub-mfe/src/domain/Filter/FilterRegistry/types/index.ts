import { FilterDataStructure, FilterForm, FilterValue } from 'models/Filters';

/**
 * Function that calculates the initial default value of a filter
 * Used when the filters are initialized
 * @param filterData - Complete filter data from the API
 * @param currentDefaults - Defaults already calculated up to the moment (useful for dependencies)
 * @returns The default value calculated for this filter
 */
export type FilterDefaultCalculator = (
  filterData: FilterDataStructure,
  currentDefaults: FilterForm,
) => FilterValue;

/**
 * Function that calculates the dependent default value of a filter
 * Usado quando um filtro pai muda e precisa resetar os dependentes
 * @param filterData - Complete filter data from the API
 * @param currentValues - Current values of the form (including the parent filter that changed)
 * @returns The new default value for this dependent filter
 */
export type FilterDependentDefaultCascadingCalculator = (
  filterData: FilterDataStructure,
  currentValues: FilterForm,
) => FilterValue;

/**
 * Function that validates if a value is valid in the available options of the filter
 * @param filterData - Complete filter data from the API
 * @param value - Value to be validated
 * @returns true if the value is valid, false otherwise
 */
export type FilterValueValidator = (
  filterData: FilterDataStructure,
  value: FilterValue,
  currentApplied?: Record<string, FilterValue>,
) => boolean;

/**
 * Function that validates the contextual relationship between two filters
 * @param dataFilters - Complete filter data from the API
 * @param parentValue - Value of the parent filter
 * @param childValue - Value of the child filter
 * @returns true if the value is valid, false otherwise
 */
export type FilterContextualValidator = (
  dataFilters: FilterDataStructure,
  parentValue: FilterValue,
  childValue: FilterValue,
) => boolean;

/**
 * Strategy for resolving collisions when changing pages
 * @param previousValue - Value of the filter on the previous page
 * @param currentDefault - Default value on the current page
 * @param currentDataFilters - Current filter data
 * @param currentValues - Resolved values up to the moment
 * @returns The resolved value after handling the collision
 */
export type FilterCollisionResolver = (
  previousValue: FilterValue,
  currentDefault: FilterValue,
  currentDataFilters: FilterDataStructure,
  currentValues: FilterForm,
) => FilterValue;

/**
 * Complete configuration of a filter
 */
export interface FilterConfig {
  /**
   * Unique filter key (ex: 'zones', 'country', 'brands')
   */
  key: string;

  /**
   * Parent filter key (ex: 'zone', 'country', 'brands')
   * If not provided, the filter is not contextual dependent on any other filter
   */
  parentKey?: string;

  /**
   * Processing order (smaller = processed first)
   * Important for filters with dependencies
   */
  order: number;

  /**
   * Whether the filter is resettable
   * If not provided, the filter is resettable by default
   */
  isResettable?: boolean;

  /**
   * Function that calculates the initial default value of this filter
   * Used when the filters are initialized
   */
  calculator: FilterDefaultCalculator;

  /**
   * Function that calculates the dependent default value of this filter
   * If not provided, uses the default calculator
   */
  dependentDefaultCascadingCalculator?: FilterDependentDefaultCascadingCalculator;

  /**
   * List of filters that depend on this filter
   * When this filter changes, the dependents are reset
   */
  dependencies?: string[];

  /**
   * Function that validates if a value is valid in the available options (optional)
   * If not provided, always returns true (assumes that any value is valid)
   */
  validator?: FilterValueValidator;

  /**
   * Function that validates the contextual relationship between two filters
   * If not provided, uses the default contextual validator (parent value must be valid)
   */
  contextualValidator?: FilterContextualValidator;

  /**
   * Marks this filter as a common filter used in collision resolution
   * Common filters are processed when navigating between pages
   */
  isCommon?: boolean;

  /**
   * Strategy for resolving collisions when changing pages
   * Called when the previous value is invalid on the new page
   * Allows intelligent fallback (e.g., L3M → QTD) before using the default
   */
  fallbackCollisionResolver?: FilterCollisionResolver;

  /**
   * Additional metadata (optional)
   */
  metadata?: {
    displayName?: string;
    description?: string;
    [key: string]: unknown;
  };
}
