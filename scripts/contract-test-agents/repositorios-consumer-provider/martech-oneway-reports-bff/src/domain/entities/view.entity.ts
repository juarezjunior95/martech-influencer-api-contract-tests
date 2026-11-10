import { InvalidViewConfigError } from "../exceptions/invalid-view-config.error";
import { ViewNotFoundError } from "@domain/exceptions/view-not-found.error";

/**
 * Properties required to create a View entity
 */
export interface ViewProps {
  view: string;
  config: ViewConfig;
  filterSets?: FilterSet[];
}

/**
 * Cache configuration for a view
 */
export interface CacheConfig {
  enabled: boolean;
  tags: string[];
}

/**
 * Filter configuration for a view
 */
export interface FilterConfig {
  default: {
    name: string;
  }[];
  [key: string]: {
    name: string;
  }[];
}

/**
 * Configuration structure for a view containing version, cache, and components
 */
export interface ViewConfig {
  version: string;
  cache?: CacheConfig;
  filters?: FilterConfig;
  components: ComponentConfig[];
}

/**
 * Configuration for a single component within a view
 */
export interface ComponentConfig {
  id: string;
  formatter: string;
  datasources: DataSourceConfig[];
}

/**
 * Configuration for a data source within a component
 */
export interface DataSourceConfig {
  name: string;
  title?: string;
  filterSet?: string;
  filters?: {
    name: string;
    defaultValue?: string | number | boolean;
  }[];
}

/**
 * Represents a single filter with name and value
 */
export interface Filter {
  name: string;
  value: string | number | boolean;
}

/**
 * Represents a collection of filters grouped by name
 */
export interface FilterSet {
  name: string;
  filters: Filter[];
}

/**
 * Represents a single item from a data source
 */
export interface DataSourceItem {
  [key: string]: string | number | boolean;
}

/**
 * Represents a data source containing an array of items
 */
export interface DataSource {
  name: string;
  title?: string;
  data: DataSourceItem[];
}

/**
 * Properties for creating a processed component
 */
export interface ProcessedComponentProps {
  id: string;
  data?: any;
  error?: string;
}

/**
 * Represents the result of processing a view
 */
export interface ProcessedViewResult {
  view: string;
  components: ProcessedComponent[];
}

/**
 * Represents a processed component with its data and potential errors
 * This is the result of processing a component configuration
 */
export class ProcessedComponent {
  readonly id: string;
  readonly data?: any;
  readonly error?: string;

  private constructor(props: ProcessedComponentProps) {
    this.id = props.id;
    this.data = props.data;
    this.error = props.error;
  }

  /**
   * Creates a new ProcessedComponent instance
   * @param props - Properties for the processed component
   * @returns New ProcessedComponent instance
   */
  static create(props: ProcessedComponentProps): ProcessedComponent {
    return new ProcessedComponent(props);
  }
}

/**
 * View entity representing a view with its configuration and components
 * Manages view data, components, and filter sets for data processing
 */
export class View {
  private view: string;
  private config: ViewConfig;
  private filterSets: FilterSet[] = [];

  private constructor(props: ViewProps) {
    this.view = props.view;
    this.setConfig(props.config);
    this.filterSets = props.filterSets || [];
  }

  /**
   * Creates a new View instance
   * @param props - Properties for the view
   * @returns New View instance
   */
  static create(props: ViewProps): View {
    return new View(props);
  }

  /**
   * Gets the view name
   * @returns The view name
   */
  getView(): string {
    return this.view;
  }

  /**
   * Sets the view configuration and validates it
   * @param config - The view configuration to set
   */
  private setConfig(config: ViewConfig): void {
    this.validateConfig(config);
    this.config = config;
  }

  /**
   * Validates the view configuration structure
   * @param config - The configuration to validate
   * @throws InvalidViewConfigError if configuration is invalid
   * @throws ViewNotFoundError if configuration is not found
   */
  private validateConfig(config: ViewConfig): void {
    if (!config) {
      throw new ViewNotFoundError();
    }

    if (!config.version) {
      throw new InvalidViewConfigError(
        "View configuration version is required",
      );
    }

    if (!config.components || config.components.length === 0) {
      throw new InvalidViewConfigError(
        "View configuration must have at least one component",
      );
    }

    // Validate each component
    for (const component of config.components) {
      this.validateComponent(component);
    }

    // Validate unique component IDs
    this.validateUniqueComponentIds(config.components);
  }

  /**
   * Validates a single component configuration
   * @param component - The component to validate
   * @throws InvalidViewConfigError if component is invalid
   */
  private validateComponent(component: ComponentConfig): void {
    if (!component.id) {
      throw new InvalidViewConfigError("Component must have an id");
    }

    if (!component.formatter) {
      throw new InvalidViewConfigError(
        `Component ${component.id} must have a formatter`,
      );
    }

    if (!component.datasources || component.datasources.length === 0) {
      throw new InvalidViewConfigError(
        `Component ${component.id} must have at least one datasource`,
      );
    }

    // Validate each datasource
    component.datasources.forEach((datasource, index) => {
      if (!datasource.name) {
        throw new InvalidViewConfigError(
          `Component ${component.id} datasource ${index} must have a name`,
        );
      }
    });
  }

  /**
   * Validates that all component IDs are unique
   * @param components - Array of components to validate
   * @throws InvalidViewConfigError if duplicate IDs are found
   */
  private validateUniqueComponentIds(components: ComponentConfig[]): void {
    const ids = components.map((c) => c.id);
    const uniqueIds = new Set(ids);

    if (ids.length !== uniqueIds.size) {
      throw new InvalidViewConfigError("Component IDs must be unique");
    }
  }

  /**
   * Gets all components from the view configuration
   * @returns Array of component configurations
   */
  getComponents(): ComponentConfig[] {
    return this.config.components;
  }

  /**
   * Gets all components to process from the view
   * @returns Array of components to process
   */
  getComponentsToProcess(): ComponentConfig[] {
    return this.getComponents();
  }

  /**
   * Sets the filter sets for the view
   * @param filterSets - Array of filter sets to set
   */
  setFilterSets(filterSets: FilterSet[]): void {
    this.filterSets = filterSets;
  }

  /**
   * Gets all filter sets for the view
   * @param sorted - If true, returns filter sets sorted by name, with filters inside each set also sorted by name
   * @returns Array of filter sets, optionally sorted
   */
  getFilterSets(sorted?: boolean): FilterSet[] {
    if (!sorted) {
      return this.filterSets;
    }

    return [...this.filterSets]
      .sort((a, b) => {
        const nameA = (a.name || "").trim().toLowerCase();
        const nameB = (b.name || "").trim().toLowerCase();
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      })
      .map((filterSet) => ({
        ...filterSet,
        filters: [...filterSet.filters].sort((a, b) => {
          const nameA = (a.name || "").trim().toLowerCase();
          const nameB = (b.name || "").trim().toLowerCase();
          return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
        }),
      }));
  }

  /**
   * Gets a specific filter set by name
   * @param filterSetName - Name of the filter set to retrieve
   * @returns The filter set if found, undefined otherwise
   */
  private getFilterSetByName(filterSetName: string): FilterSet | undefined {
    return this.filterSets.find((fs) => fs.name === filterSetName);
  }

  /**
   * Gets filter set for a specific datasource configuration
   * Returns default filter set if the specified one is not found
   * @param datasourceConfig - The datasource configuration
   * @returns The filter set if found, default filter set otherwise
   */
  getFilterSetByDatasourceConfig(
    datasourceConfig: DataSourceConfig,
  ): FilterSet | undefined {
    if (datasourceConfig.filterSet) {
      const filterSet = this.getFilterSetByName(datasourceConfig.filterSet);
      if (filterSet) {
        return filterSet;
      }
    }

    // Return default filter set if specified one is not found
    return this.getDefaultFilterSet();
  }

  /**
   * Gets the default filter set (filter set with empty name)
   * @returns The default filter set if found, undefined otherwise
   */
  getDefaultFilterSet(): FilterSet | undefined {
    return this.filterSets.find((filterSet) => filterSet.name === "");
  }

  /**
   * Gets merged filters for a datasource configuration
   * @param datasourceConfig
   * @returns Merged an array of filters
   */
  getFiltersForDatasource(
    datasourceConfig: DataSourceConfig,
  ): Filter[] | undefined {
    const filterSet = this.getFilterSetByDatasourceConfig(datasourceConfig);
    const filtersMap = new Map<string, Filter>();

    datasourceConfig.filters?.forEach((filterConfig) => {
      if (filterConfig.defaultValue !== undefined) {
        filtersMap.set(filterConfig.name, {
          name: filterConfig.name,
          value: filterConfig.defaultValue,
        });
      }
    });

    filterSet?.filters.forEach((filter) => {
      filtersMap.set(filter.name, filter);
    });

    return filtersMap.size > 0 ? Array.from(filtersMap.values()) : undefined;
  }

  /**
   * Gets the cache configuration for the view
   * Returns default config with enabled: true if not specified in config
   * @returns CacheConfig with default values applied
   */
  getCacheConfig(): CacheConfig {
    const cacheConfig = this.config.cache;

    if (!cacheConfig) {
      return {
        enabled: true,
        tags: [],
      };
    }

    return {
      enabled: cacheConfig.enabled ?? true,
      tags: cacheConfig.tags || [],
    };
  }
}
