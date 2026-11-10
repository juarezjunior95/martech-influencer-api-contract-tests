import type {
  FilterDataStructure,
  FilterForm,
  FilterPage,
  FilterValue,
} from 'models/Filters';

import { PerformanceToolFilterDataTransformer } from '../FilterDataTransformer';
import type {
  FilterConfig,
  FilterContextualValidator,
  FilterDefaultCalculator,
  FilterDependentDefaultCascadingCalculator,
  FilterValueValidator,
} from './types';
import {
  defaultValidator,
  resolveBrandsCollisions as resolveBrandsCollisionsHelper,
  resolveGrowthLeversCollisions as resolveGrowthLeversCollisionsHelper,
} from './utils';

/**
 * Registry of filter configurations
 * Implements Singleton pattern to ensure unique instance
 */
class FilterRegistry {
  private static readonly EXTERNAL_URL_REGEX = /^https?:\/\//;
  private static instance: FilterRegistry;
  private readonly filters: Map<string, FilterConfig>;
  private readonly orderIndex: Map<number, string[]>;

  private constructor() {
    this.filters = new Map();
    this.orderIndex = new Map();
  }

  /**
   * Returns the singleton instance of the registry
   */
  public static getInstance(): FilterRegistry {
    if (!FilterRegistry.instance) {
      FilterRegistry.instance = new FilterRegistry();
    }
    return FilterRegistry.instance;
  }

  /**
   * Registers a new filter configuration
   * @param config Filter configuration
   * @throws Error if a filter with the same key already exists
   */
  public register(config: FilterConfig): void {
    const fullConfig: FilterConfig = {
      ...config,
    };

    this.filters.set(config.key, fullConfig);

    const keysAtOrder = this.orderIndex.get(config.order) || [];
    if (!keysAtOrder.includes(config.key)) {
      keysAtOrder.push(config.key);
      this.orderIndex.set(config.order, keysAtOrder);
    }
  }

  /**
   * Returns the configuration of a filter
   * @param key Filter key
   * @returns Filter configuration or undefined if not found
   */
  public get(key: string): FilterConfig | undefined {
    return this.filters.get(key);
  }

  /**
   * Returns all registered filter keys, ordered by processing order
   * @returns Array of ordered keys
   */
  public getOrderedKeys(): string[] {
    const orders = Array.from(this.orderIndex.keys()).sort((a, b) => a - b);
    const orderedKeys: string[] = [];

    for (const order of orders) {
      const keys = this.orderIndex.get(order) || [];
      orderedKeys.push(...keys);
    }

    return orderedKeys;
  }

  /**
   * Returns all registered configurations
   * @returns Array of all configurations
   */
  public getAll(): FilterConfig[] {
    return Array.from(this.filters.values());
  }

  /**
   * Returns the calculator of a filter
   * @param key Filter key
   * @returns Calculator ou undefined se não encontrado
   */
  public getCalculator(key: string): FilterDefaultCalculator | undefined {
    return this.filters.get(key)?.calculator;
  }

  /**
   * Returns the dependent default calculator of a filter
   * If not provided, returns the default calculator
   * @param key Filter key
   * @returns Dependent calculator or default calculator
   */
  public getDependentDefaultCascadingCalculator(
    key: string,
  ):
    | FilterDependentDefaultCascadingCalculator
    | FilterDefaultCalculator
    | undefined {
    const config = this.filters.get(key);
    return config?.dependentDefaultCascadingCalculator || config?.calculator;
  }

  /**
   * Returns the validator of a filter
   * @param key Filter key
   * @returns Validator or undefined if not found
   */
  public getValidator(key: string): FilterValueValidator | undefined {
    return this.filters.get(key)?.validator;
  }

  /**
   * Validates if a value is valid for a filter
   * @param key Filter key
   * @param filterData Filter data
   * @param value Value to be validated
   * @returns true if valid, false otherwise (or true if no validator)
   */
  public isValueValid(
    key: string,
    filterData: FilterDataStructure,
    value: FilterValue,
    currentApplied?: Record<string, FilterValue>,
  ): boolean {
    const validator = this.getValidator(key);

    if (!validator) {
      return defaultValidator(key, filterData, value);
    }

    return validator(filterData, value, currentApplied ?? {});
  }

  /**
   * Returns the contextual validator of a filter
   * @param key Filter key
   * @returns Contextual validator or undefined if not found
   */
  public getContextualValidator(
    key: string,
  ): FilterContextualValidator | undefined {
    return this.filters.get(key)?.contextualValidator;
  }

  /**
   * Validates if a value is valid for a filter
   * @param key Filter key
   * @param filterData Filter data
   * @param value Value to be validated
   * @returns true if valid, false otherwise (or true if no validator)
   */
  public isContextualValid(
    key: string,
    filters: FilterForm,
    dataFilters: FilterDataStructure | Record<string, unknown>,
    value: FilterValue,
  ): boolean {
    const contextualValidator = this.getContextualValidator(key);

    const parentKey = this.filters.get(key)?.parentKey;
    const parentValue = filters[parentKey];

    if (!contextualValidator) {
      return this.isValueValid(key, dataFilters, value);
    }

    return contextualValidator(dataFilters, String(parentValue), String(value));
  }

  /**
   * Picks contextual or value-based validation depending on whether the parent
   * filter has already been resolved in the current collision-resolution pass.
   * Avoids calling the contextualValidator with an undefined parent value.
   */
  private resolveIsValid(
    filterKey: string,
    resolved: Record<string, FilterValue>,
    currentDataFilters: FilterDataStructure,
    previousValue: FilterValue,
    currentApplied: Record<string, FilterValue>,
  ): boolean {
    const parentKey = this.filters.get(filterKey)?.parentKey;
    const parentResolved =
      parentKey !== undefined && resolved[parentKey] !== undefined;

    if (parentKey && parentResolved) {
      return this.isContextualValid(
        filterKey,
        resolved,
        currentDataFilters,
        previousValue,
      );
    }

    return this.isValueValid(
      filterKey,
      currentDataFilters,
      previousValue,
      currentApplied,
    );
  }

  /**
   * Returns the dependencies of a filter
   * @param key Filter key
   * @returns Array of dependent filter keys
   */
  public getDependencies(key: string): string[] {
    return this.filters.get(key)?.dependencies || [];
  }

  /**
   * Returns if a filter is resettable
   * @param key Filter key
   * @returns true if the filter is resettable, false otherwise
   */
  public isResettable(key: string): boolean {
    return this.filters.get(key)?.isResettable ?? true;
  }

  /**
   * Checks if a filter is registered
   * @param key Filter key
   * @returns true if the filter is registered
   */
  public has(key: string): boolean {
    return this.filters.has(key);
  }

  /**
   * Returns the number of registered filters
   */
  public size(): number {
    return this.filters.size;
  }

  /**
   * Returns the keys of filters marked as common
   * Common filters are processed during collision resolution between pages
   * @returns Array of common filter keys
   */
  public getCommonFilterKeys(): string[] {
    const commonKeys: string[] = [];

    for (const [key, config] of this.filters.entries()) {
      if (config.isCommon === true) {
        commonKeys.push(key);
      }
    }

    return commonKeys;
  }

  // ============================================================
  // STATIC METHODS - Utils integrated into the registry
  // ============================================================

  /**
   * Calculates the default values of all filters based on the registry configuration
   * @param filterData - Filter data coming from the API
   * @returns Object with all default values calculated
   */
  public static calculateDefaults(
    filterData: FilterDataStructure,
  ): Record<string, FilterValue> {
    const registry = FilterRegistry.getInstance();
    const defaults: Record<string, FilterValue> = {};

    const orderedKeys = registry.getOrderedKeys();

    for (const key of orderedKeys) {
      const calculator = registry.getCalculator(key);

      if (calculator) {
        defaults[key] = calculator(filterData, defaults);
      }
    }

    return defaults;
  }

  /**
   * Calculates the default value for a dependent filter when the parent filter changes
   * @param filterData - Filter data coming from the API
   * @param dependentKey - Dependent filter key
   * @param currentValues - Current values of the form
   * @returns New default value for the dependent filter
   */
  public static getDependentDefaultCascading(
    filterData: FilterDataStructure,
    dependentKey: string,
    currentValues: Record<string, FilterValue>,
  ): FilterValue | null {
    const registry = FilterRegistry.getInstance();

    const calculator =
      registry.getDependentDefaultCascadingCalculator(dependentKey);

    if (calculator) {
      return calculator(filterData, currentValues);
    }

    return null;
  }

  /**
   * Resolve cascading updates when a filter is changed
   * Resets the dependent filters to their default values
   * @param filterData - Filter data coming from the API
   * @param currentForm - Current form
   * @param updateKey - Key of the filter being updated
   * @param updateValue - New value of the filter
   * @returns Updated form with resolved dependencies
   */
  public static resolveCascadingUpdates(
    filterData: FilterDataStructure,
    currentForm: Record<string, FilterValue>,
    updateKey: string,
    updateValue: FilterValue,
  ): Record<string, FilterValue> {
    const registry = FilterRegistry.getInstance();
    const updatedForm: Record<string, FilterValue> = {
      ...currentForm,
      [updateKey]: updateValue,
    };

    const dependentKeys = registry.getDependencies(updateKey);

    for (const dependentKey of dependentKeys) {
      const newDefault = FilterRegistry.getDependentDefaultCascading(
        filterData,
        dependentKey,
        updatedForm,
      );

      updatedForm[dependentKey] = newDefault ?? null;
    }

    return updatedForm;
  }

  /**
   * Validates if a set of values is valid for the filters
   * @param filterData - Filter data coming from the API
   * @param values - Values to be validated
   * @returns Object with the validation result for each filter
   */
  public static validateValues(
    filterData: FilterDataStructure,
    values: Record<string, FilterValue>,
  ): Record<string, boolean> {
    const registry = FilterRegistry.getInstance();
    const orderedKeys = registry.getOrderedKeys();
    const validationResults: Record<string, boolean> = {};

    for (const key of orderedKeys) {
      validationResults[key] = registry.isValueValid(
        key,
        filterData,
        values[key],
      );
    }

    return validationResults;
  }

  /**
   * Resolve collisions of filters when changing pages
   * Keeps valid values from the previous page and converts between related filter types
   * @param currentDataFilters - Filter data from the current page
   * @param previousApplied - Applied values from the previous page
   * @param currentDefaults - Default values from the current page
   * @returns Resolved values after collision treatment
   */
  public static resolveFilterCollisions(
    currentPage: FilterPage,
    previousPage: FilterPage,
    currentDefaults: Record<string, FilterValue>,
  ): Record<string, FilterValue> {
    const registry = FilterRegistry.getInstance();
    const resolved: Record<string, FilterValue> = {};

    if (!currentPage || currentPage?.status === 'idle') {
      return currentDefaults;
    }

    if (previousPage?.status !== 'loaded') {
      return currentDefaults;
    }

    const previousApplied = previousPage.applied;
    const currentDataFilters = currentPage.dataFilters;
    const currentApplied = currentPage.applied;

    const orderedKeys = registry.getOrderedKeys();

    for (const filterKey of orderedKeys) {
      const previousValue = previousApplied[filterKey];
      const isValid = registry.resolveIsValid(
        filterKey,
        resolved,
        currentDataFilters,
        previousValue,
        currentApplied,
      );

      if (isValid && previousValue) {
        resolved[filterKey] = previousValue;
      } else {
        const defaultValue = FilterRegistry.getDependentDefaultCascading(
          currentDataFilters,
          filterKey,
          {
            ...currentDefaults,
            ...resolved,
          },
        );

        const collisionResolver =
          registry.get(filterKey)?.fallbackCollisionResolver;
        if (collisionResolver && previousValue) {
          resolved[filterKey] = collisionResolver(
            previousValue,
            defaultValue,
            currentDataFilters,
            resolved,
          );
        } else {
          resolved[filterKey] = defaultValue;
        }
      }
    }

    const previousCountry =
      previousApplied.country || resolved.country || currentDefaults.country;

    // Uses helper to resolve collisions of brands
    const brandsResolved = resolveBrandsCollisionsHelper(
      registry,
      previousApplied,
      currentDataFilters,
      currentDefaults,
      previousCountry,
    );

    const growthLeversResolved = resolveGrowthLeversCollisionsHelper(
      previousApplied,
      currentDataFilters,
      currentDefaults,
      resolved,
    );

    return {
      ...resolved,
      ...brandsResolved,
      ...growthLeversResolved,
    };
  }

  /**
   * Extract filters from URL query parameters
   */
  public static extractFiltersFromUrl(
    searchParams: URLSearchParams,
  ): Record<string, FilterValue> {
    const filters: Record<string, FilterValue> = {};
    const filterRegex = /^filter_(.+)$/;
    const malformedValueRegex = /filter_/;
    const uppercaseFilters = new Set(['country', 'zone']);

    searchParams.forEach((value, key) => {
      const match = filterRegex.exec(key);
      if (match) {
        if (malformedValueRegex.test(value)) {
          const indexOfFilter = value.indexOf('filter_');
          value = value.substring(0, indexOfFilter).trim();
        }
        filters[match[1]] = uppercaseFilters.has(match[1])
          ? value.toUpperCase()
          : value;
      }
    });
    return filters;
  }

  /**
   * Validate complete filter set
   */
  public static validateCompleteFilterSet(
    filters: Record<string, FilterValue>,
    dataFilters: Record<string, unknown>,
    defaults: Record<string, FilterValue>,
  ): Record<string, FilterValue> {
    const registry = FilterRegistry.getInstance();
    const orderedKeys = registry.getOrderedKeys();
    let result: Record<string, FilterValue> = {};

    for (const key of orderedKeys) {
      const value = filters[key];

      // Validate the value that came from the URL
      const isValid = registry.isContextualValid(
        key,
        result,
        dataFilters,
        value,
      );

      if (isValid) {
        result = FilterRegistry.resolveCascadingUpdates(
          dataFilters,
          result,
          key,
          value,
        );
      } else {
        const defaultValue = FilterRegistry.getDependentDefaultCascading(
          dataFilters,
          key,
          result,
        );

        const collisionResolver = registry.get(key)?.fallbackCollisionResolver;
        const resolved =
          collisionResolver && value != null
            ? collisionResolver(value, defaultValue, dataFilters, result)
            : defaultValue;

        if (resolved !== null && resolved !== undefined) {
          result = FilterRegistry.resolveCascadingUpdates(
            dataFilters,
            result,
            key,
            resolved,
          );
        }
      }
    }

    return result;
  }

  /**
   * Validate and extract filters from URL
   */
  public static validateUrlFilters(
    searchParams: URLSearchParams,
    dataFilters: Record<string, unknown>,
    defaults: Record<string, FilterValue>,
    rawData?: any,
  ): Record<string, FilterValue> {
    const urlFilters = this.extractFiltersFromUrl(searchParams);
    if (Object.keys(urlFilters).length === 0) {
      return {};
    }

    // Merge URL filters with defaults (URL overrides defaults)
    const merged = {
      ...defaults,
      ...Object.fromEntries(
        Object.entries(urlFilters).filter(
          ([key, value]) =>
            value !== null && value !== undefined && value !== '',
        ),
      ),
    };
    let dataFiltersForValidation: Record<string, unknown> = dataFilters;
    if (
      rawData &&
      PerformanceToolFilterDataTransformer.isValidFormat(rawData)
    ) {
      dataFiltersForValidation = PerformanceToolFilterDataTransformer.transform(
        rawData,
        (merged.kpis as string) || (defaults.kpis as string),
        merged,
      ) as Record<string, unknown>;
    }
    // Validate complete set
    const validated = this.validateCompleteFilterSet(
      merged,
      dataFiltersForValidation,
      defaults,
    );

    return validated;
  }

  /**
   * Build a query string from filter values, with optional overrides
   */
  public static buildFilterQueryString(
    filters: Record<string, any>,
    overrides?: Record<string, any>,
  ): string {
    const params = new URLSearchParams();
    const merged = { ...filters, ...overrides };

    Object.entries(merged).forEach(([key, value]) => {
      if (value != null && value !== '') {
        params.set(`filter_${key}`, String(value));
      }
    });

    return params.toString();
  }

  /**
   * Update URL parameters with validated filters
   */
  public static updateUrlParams(
    filters: Record<string, any>,
    setSearchParams: (params: URLSearchParams) => void,
    currentParams: URLSearchParams,
  ): void {
    const newParams = new URLSearchParams(currentParams);

    // Remove old filters
    const keysToRemove: string[] = [];
    newParams.forEach((_, key) => {
      if (key.startsWith('filter_')) {
        keysToRemove.push(key);
      }
    });
    keysToRemove.forEach((key) => newParams.delete(key));

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        newParams.set(`filter_${key}`, String(value));
      }
    });

    setSearchParams(newParams);
  }

  /**
   * Merges current filter_* params from `sourceSearch` into the given `href`,
   * without overriding filter_* params already present in the href.
   * Returns the href unchanged for empty values, '#', or external (http/https) URLs.
   * @param href - Target href (can be a pathname, with or without query string)
   * @param sourceSearch - Source query string (with or without leading '?')
   * @returns The href with filter_* params merged in
   */
  public static mergeFilterParamsIntoHref(
    href: string,
    sourceSearch: string,
  ): string {
    if (!href || href === '#') return href;
    if (FilterRegistry.EXTERNAL_URL_REGEX.test(href)) return href;

    const [pathname, hrefSearch = ''] = href.split('?');
    const target = new URLSearchParams(hrefSearch);
    const source = new URLSearchParams(sourceSearch);

    source.forEach((value, key) => {
      if (key.startsWith('filter_') && !target.has(key)) {
        target.set(key, value);
      }
    });

    const finalSearch = target.toString();
    return finalSearch ? `${pathname}?${finalSearch}` : pathname;
  }
}

export default FilterRegistry;
