import { DatasourceConfig } from "@domain/entities/datasource.entity";

/**
 * Interface for datasource configuration repository
 * Handles loading datasource configurations from files
 */
export interface IDatasourceConfigRepository {
  /**
   * Gets datasource configuration by name
   * @param datasourceName - Name of the datasource (e.g., "value-creation/portfolio-performance/overview/category-growth-levers/occasions-development")
   * @returns Promise with DatasourceConfig
   */
  getByName(datasourceName: string): Promise<DatasourceConfig>;
}
