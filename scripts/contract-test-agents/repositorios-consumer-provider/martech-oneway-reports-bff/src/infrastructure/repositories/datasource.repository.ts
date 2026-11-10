import { Injectable, Logger } from "@nestjs/common";
import { IDataRepository } from "@domain/repositories/datasource.repository.interface";
import { DataSource, Filter } from "@domain/entities/view.entity";
import { DataServiceClient } from "@infrastructure/services/data-service.client";
import { firstValueFrom } from "rxjs";

@Injectable()
export class DataRepository implements IDataRepository {
  private readonly logger = new Logger(DataRepository.name);

  constructor(private readonly dataServiceClient: DataServiceClient) {}

  /**
   * Retrieves data from a specific datasource with optional filtering.
   *
   * @param datasource - The name of the datasource to retrieve data from
   * @param filters - Optional array of filters to apply to the data
   * @returns Promise with the filtered data
   */
  async getData(datasource: string, filters?: Filter[]): Promise<DataSource> {
    try {
      // Convert filters to query parameters
      const queryParams = this.convertFiltersToQueryParams(filters);

      // Call data service
      const response = await firstValueFrom(
        this.dataServiceClient.get(`/datasources/${datasource}`, queryParams),
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to get data from datasource '${datasource}': ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Converts filters to query parameters for the data service
   * @param filters - Array of filters to convert
   * @returns Query parameters object
   */
  private convertFiltersToQueryParams(filters?: Filter[]): Record<string, any> {
    if (!filters || filters.length === 0) {
      return {};
    }

    const queryParams: Record<string, any> = {};

    filters.forEach((filter) => {
      queryParams[`filter[${filter.name}]`] = filter.value;
    });

    return queryParams;
  }
}
