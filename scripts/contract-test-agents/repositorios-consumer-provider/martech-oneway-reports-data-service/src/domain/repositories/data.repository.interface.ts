import { EntityClass, Filter } from "@domain/entities/datasource.entity";
import { DataType } from "@domain/entities/common/base-config.entity";

/**
 * Base configuration interface for data providers
 * All provider-specific configs extend from this
 */
export interface FetchDataConfig {
  [key: string]: string | number | boolean | string[];
}

/**
 * Generic Data Repository Interface
 * Manages data source operations with external data providers
 */
export interface IDataRepository {
  /**
   * Fetches data from a specific data source with filters
   * @param fetchDataConfig - Provider-specific configuration (from datasetConfig.config)
   *                         Contains query, params, config, etc. as needed by the provider
   *                         Can be null if no configuration is provided
   *                         Inside the method, can be accessed as 'config' (e.g., config.query)
   * @param filters - Array of filters to apply to the query
   * @param entityClass
   * @returns Array of data items
   */
  fetchData(
    fetchDataConfig: FetchDataConfig | null,
    filters: Filter[],
    entityClass?: EntityClass,
  ): Promise<DataType>;
}
