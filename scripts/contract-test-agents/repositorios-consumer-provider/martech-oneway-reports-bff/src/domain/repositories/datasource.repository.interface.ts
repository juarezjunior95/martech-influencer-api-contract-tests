import { DataSource, Filter } from "@domain/entities/view.entity";

/**
 * Data Repository Interface
 * Manages data access for different datasources
 */
export interface IDataRepository {
  /**
   * Retrieves data from a specific datasource
   * @param datasource - Name of the datasource
   * @param filters - Optional array of filters to apply
   * @returns Promise with the retrieved data as DataSource
   */
  getData(datasource: string, filters?: Filter[]): Promise<DataSource>;
}
