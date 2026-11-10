import {
  DatasetRepositoryFactory,
  RepositoryType,
} from "@domain/factories/dataset-repository.factory";
import {
  BaseConfig,
  BaseConfigEntity,
  DataItem,
  Dataset,
  DatasetConfig,
  Filter,
  FilterConfig,
} from "./common/base-config.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { IDatasourceHandler } from "@domain/interfaces/datasource-handler.interface";

// Re-export to keep compatibility
export { DataItem, Dataset, DatasetConfig, FilterConfig, Filter };

/**
 * Extended types for Datasource (supports KpiEntity mapping)
 */
export type DatasourceDataType = KpiEntity[] | DataItem[];
export type EntityClass = typeof KpiEntity;

/**
 * Datasource Configuration
 * Contains handler and filter configurations for a datasource
 */
export interface DatasourceConfig extends BaseConfig {
  handler?: IDatasourceHandler;
  entityClass?: EntityClass;
  /**
   * When true, raw rows are passed to the handler first and {@link entityClass}
   * is applied to the handler output. Defaults to false (entity mapping happens
   * before the handler, preserving existing datasource behavior).
   */
  entityClassAfterHandler?: boolean;
}

/**
 * Datasource entity class
 * Represents a datasource with its configuration and data processing capabilities
 */
export class DatasourceEntity extends BaseConfigEntity<
  DatasourceConfig,
  DatasourceDataType
> {
  constructor(
    datasetRepositoryFactory: DatasetRepositoryFactory,
    datasourceConfig: DatasourceConfig,
    name: string,
  ) {
    super(datasetRepositoryFactory, datasourceConfig, name);
  }

  /**
   * Loads datasets by iterating through the datasetConfigs
   * @param {Filter[]} filters - Array of filters to apply to the queries
   * @returns {Promise<Dataset[]>} Promise with an array of loaded datasets
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

      const data = await repository.fetchData(
        datasetConfig.config,
        filters,
        this.shouldMapEntityBeforeHandler()
          ? this.config?.entityClass
          : undefined,
      );

      datasets.push({
        id: datasetConfig.id,
        data,
      });
    }

    return datasets;
  }

  /**
   * Fetches data from the datasource
   * Loads datasets, applies filters, and fetches with handler if configured
   * @param {Filter[]} filters - Array of filters to apply to the queries
   * @returns {Promise<DatasourceDataType>} Promise with an array of data items
   * @throws {MissingRequiredFilterError} If required filters are missing
   */
  public async fetch(filters: Filter[]): Promise<DatasourceDataType> {
    const datasets = await this.loadDatasets(filters);
    const defaultDataset = this.getDefaultDataset(datasets);

    const handled = this.config?.handler
      ? (await this.config.handler?.handle(datasets, defaultDataset)) || []
      : defaultDataset?.data || [];

    if (this.shouldMapEntityAfterHandler()) {
      return handled.map((row) => new this.config!.entityClass!(row));
    }

    return handled;
  }

  private shouldMapEntityBeforeHandler(): boolean {
    return (
      Boolean(this.config?.entityClass) && !this.config?.entityClassAfterHandler
    );
  }

  private shouldMapEntityAfterHandler(): boolean {
    return Boolean(
      this.config?.entityClass && this.config?.entityClassAfterHandler,
    );
  }
}
