import { FetchDataConfig } from "@domain/repositories/data.repository.interface";
import {
  DatasetRepositoryFactory,
  RepositoryType,
} from "../../factories/dataset-repository.factory";
import { MissingRequiredFilterError } from "../../exceptions/missing-required-filter.error";

/**
 * Represents a single item from a dataset
 */
export interface DataItem {
  [key: string]: string | number | object | boolean;
}

/**
 * Represents the type of data returned by a config entity
 */
export type DataType = DataItem[];

/**
 * Represents a dataset with its name and configuration
 */
export interface DatasetConfig {
  id?: string;
  provider?: string;
  config: FetchDataConfig;
}

/**
 * Represents the result of processing a dataset
 * Contains the dataset identifier and its data items
 */
export interface Dataset {
  id: string;
  data: DataType;
}

/**
 * Filter configuration for datasource validation
 * Defines which filters are required for a datasource
 */
export interface FilterConfig {
  name: string;
  required?: boolean;
}

/**
 * Represents a single filter with name and value.
 *
 * `namespace` mirrors the outer key in the legacy Drupal query shape
 * (`<namespace>[<name>]=<value>`). Defaults to `"filter"` for callers
 * still emitting the camelCase `?filter[...]` shape, so existing
 * datasource pipelines remain unaffected.
 */
export interface Filter {
  namespace?: string;
  name: string;
  value: string | number | boolean;
}

/**
 * Base configuration interface
 */
export interface BaseConfig {
  version?: string;
  filters?: FilterConfig[];
  datasets?: DatasetConfig[];
}

/**
 * Abstract base class for config-based entities (Datasource, Preset)
 * Provides common functionality for loading datasets and validating filters
 */
export abstract class BaseConfigEntity<
  ConfigType extends BaseConfig,
  ResultType,
> {
  protected readonly name: string;
  readonly config: ConfigType;

  constructor(
    protected readonly datasetRepositoryFactory: DatasetRepositoryFactory,
    config: ConfigType,
    name: string,
  ) {
    this.name = name;
    this.config = config;
  }

  /**
   * Gets the data source name
   * @returns {string} The data source name
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Validates filters according to filters configuration
   * @param {Filter[]} filters - Array of filters to validate
   * @throws {MissingRequiredFilterError} If a required filter is missing
   */
  protected validateRequiredFilters(filters: Filter[]): void {
    if (!this.config?.filters || this.config.filters.length === 0) {
      return;
    }

    const providedFilterNames = new Set(filters.map((filter) => filter.name));

    for (const filterConfig of this.config.filters) {
      if (filterConfig.required === false) {
        continue;
      }
      if (!providedFilterNames.has(filterConfig.name)) {
        throw new MissingRequiredFilterError(filterConfig.name, this.getName());
      }
    }
  }

  /**
   * Loads datasets by iterating through the datasetConfigs
   */
  protected async loadDatasets(filters: Filter[]): Promise<Dataset[]> {
    this.validateRequiredFilters(filters);

    const datasets: Dataset[] = [];

    if (!this.config?.datasets || this.config.datasets.length === 0) {
      return datasets;
    }

    for (const datasetConfig of this.config.datasets) {
      const repository = this.datasetRepositoryFactory.resolveRepository(
        datasetConfig.config.type as RepositoryType,
      );

      const data = await repository.fetchData(datasetConfig.config, filters);

      datasets.push({
        id: datasetConfig.id,
        data,
      });
    }

    return datasets;
  }

  /**
   * Gets the default dataset (first dataset) from the provided array
   */
  protected getDefaultDataset(datasets: Dataset[]): Dataset | undefined {
    return datasets?.[0];
  }

  /**
   * Fetches data from the datasource
   * Loads datasets, applies filters, and fetches with handler if configured
   */
  public abstract fetch(filters: Filter[]): Promise<ResultType>;
}
