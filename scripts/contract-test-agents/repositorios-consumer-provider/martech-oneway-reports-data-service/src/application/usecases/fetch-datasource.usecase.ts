import { Injectable, Logger, Inject } from "@nestjs/common";
import { Filter, DataItem } from "@domain/entities/datasource.entity";
import { DatasourceFactory } from "@domain/factories/datasource.factory";
import { IUseCase } from "@application/interfaces/usecase.interface";

/**
 * Fetch DataSource Use Case
 * Fetches data from a specific datasource with optional filters
 */
@Injectable()
export class FetchDataSourceUseCase implements IUseCase<
  { dataSourceName: string; filters: Filter[] },
  DataItem[]
> {
  private readonly logger = new Logger(FetchDataSourceUseCase.name);

  constructor(
    @Inject("DatasourceFactory")
    private readonly datasourceFactory: DatasourceFactory,
  ) {}

  /**
   * Fetches data from a datasource
   * @param dataSourceName - Name of the datasource
   * @param filters - Array of filters to apply
   * @returns Array of data items
   */
  async execute({ dataSourceName, filters }): Promise<DataItem[]> {
    try {
      const dataSource = await this.datasourceFactory.create(dataSourceName);
      const data = await dataSource.fetch(filters);

      this.logger.log(`Datasource '${dataSourceName}' fetched successfully`);

      return data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch datasource '${dataSourceName}': ${error.message}`,
      );
      throw error;
    }
  }
}
