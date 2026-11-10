import { Injectable, Inject } from "@nestjs/common";
import { DatasourceEntity } from "@domain/entities/datasource.entity";
import { IDatasourceConfigRepository } from "@domain/repositories/datasource-config.repository.interface";
import { DatasetRepositoryFactory } from "@domain/factories/dataset-repository.factory";

/**
 * Factory for creating DatasourceEntity instances
 * Loads datasource configurations from files and creates entity instances
 */
@Injectable()
export class DatasourceFactory {
  constructor(
    @Inject("DatasourceConfigRepository")
    private readonly datasourceConfigRepository: IDatasourceConfigRepository,
    @Inject("DatasetRepositoryFactory")
    private readonly datasetRepositoryFactory: DatasetRepositoryFactory,
  ) {}

  /**
   * Creates a datasource instance by name
   * Loads the configuration file and creates a DatasourceEntity instance
   * @param {string} dataSourceName - Name of the datasource (e.g., "value-creation_portfolio-performance_overview_category-growth-levers_beyond-beer")
   * @returns {Promise<DatasourceEntity>} Promise with DatasourceEntity instance
   * @throws {DatasourceNotFoundError} If datasource config is not found
   */
  async create(dataSourceName: string): Promise<DatasourceEntity> {
    return new DatasourceEntity(
      this.datasetRepositoryFactory,
      await this.datasourceConfigRepository.getByName(dataSourceName),
      dataSourceName,
    );
  }
}
