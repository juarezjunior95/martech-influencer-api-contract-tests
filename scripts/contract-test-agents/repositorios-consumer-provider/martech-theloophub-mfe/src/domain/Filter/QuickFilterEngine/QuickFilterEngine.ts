import { FilterDataStructure } from 'models/Filters';

import FilterRegistry from '../FilterRegistry/FilterRegistry';

export interface QuickFilterContext {
  fieldKey: string;
  pageName: string;
  appliedFilters: Record<string, string | number>;
  dataFilters?: FilterDataStructure;
}

export type FilterRule = (context: QuickFilterContext) => boolean;

/**
 * QuickFilterEngine
 * Determines which filters should be visible based on business rules
 */
class QuickFilterEngine {
  private static instance: QuickFilterEngine;
  private rules: FilterRule[] = [];
  private readonly availableComponents: string[];

  public constructor(availableComponents: string[]) {
    this.availableComponents = availableComponents;
    this.initializeRules();
  }

  public static getInstance(availableComponents: string[]): QuickFilterEngine {
    if (!QuickFilterEngine.instance) {
      QuickFilterEngine.instance = new QuickFilterEngine(availableComponents);
    }
    return QuickFilterEngine.instance;
  }

  /**
   * Initialize all filter rules
   */
  private initializeRules(): void {
    this.rules = [
      this.isRegisteredInFilterRegistry,
      this.hasQuickFilterComponent,
      this.dependenciesAreSatisfied,
      this.hasAvailableOptions,
    ];
  }

  /**
   * Rule: Field must be registered in the FilterRegistry
   */
  private readonly isRegisteredInFilterRegistry: FilterRule = ({
    fieldKey,
  }) => {
    const registry = FilterRegistry.getInstance();
    return registry.has(fieldKey);
  };

  /**
   * Rule: Field must have a Quick Filter component available
   */
  private readonly hasQuickFilterComponent: FilterRule = ({ fieldKey }) => {
    const registry = FilterRegistry.getInstance();
    const config = registry.get(fieldKey);

    if (config?.metadata?.quickFilter === false) {
      return false;
    }

    return this.availableComponents.includes(fieldKey);
  };

  /**
   * Rule: Dependent filters only appear if their parents are filled
   */
  private readonly dependenciesAreSatisfied: FilterRule = ({
    fieldKey,
    pageName,
    appliedFilters,
  }) => {
    const isPerformanceTool = pageName?.includes(
      'value-creation/performance-tool',
    );

    if (fieldKey === 'zone') {
      return false;
    }

    if (fieldKey === 'brands') {
      if (isPerformanceTool) {
        return (
          appliedFilters.brands !== 'All' ||
          (appliedFilters.sub_brands && appliedFilters.sub_brands !== 'All')
        );
      }
      return appliedFilters.brands !== 'All';
    }

    if (fieldKey === 'sub_brands') {
      if (isPerformanceTool) return false;
      return appliedFilters.sub_brands !== 'All';
    }

    if (fieldKey === 'brands_abi') {
      return appliedFilters.brands_abi !== 'All';
    }

    if (fieldKey === 'global_brands') {
      return (
        appliedFilters.global_brands !== 'All' && !!appliedFilters.global_brands
      );
    }

    if (fieldKey === 'portfolios') {
      return appliedFilters.portfolios !== 'All';
    }

    if (fieldKey === 'beer_price_segment') {
      return appliedFilters.beer_price_segment !== 'All';
    }

    if (fieldKey === 'brand_filter_groupings') {
      return appliedFilters.brand_filter_groupings === 'Global Brands';
    }

    return true;
  };

  /**
   * Rule: Field only appears if there are available options
   */
  private readonly hasAvailableOptions: FilterRule = ({
    fieldKey,
    dataFilters,
    appliedFilters,
  }) => {
    if (!dataFilters) return true;

    const registry = FilterRegistry.getInstance();
    const config = registry.get(fieldKey);

    if (!config) return false;

    return config.validator(
      dataFilters,
      appliedFilters[fieldKey],
      appliedFilters,
    );
  };

  /**
   * Apply all rules to a single field
   */
  public validateField(context: QuickFilterContext): boolean {
    return this.rules.every((rule) => rule(context));
  }

  /**
   * Apply all rules to multiple fields
   */
  public filterFields(
    fields: string[],
    context: Omit<QuickFilterContext, 'fieldKey'>,
  ): string[] {
    return fields.filter((fieldKey) => {
      const ruleContext: QuickFilterContext = { ...context, fieldKey };
      return this.validateField(ruleContext);
    });
  }

  /**
   * Add a custom rule dynamically
   */
  public addRule(rule: FilterRule): void {
    this.rules.push(rule);
  }

  /**
   * Get all registered rules
   */
  public getRules(): FilterRule[] {
    return [...this.rules];
  }
}

export default QuickFilterEngine;
