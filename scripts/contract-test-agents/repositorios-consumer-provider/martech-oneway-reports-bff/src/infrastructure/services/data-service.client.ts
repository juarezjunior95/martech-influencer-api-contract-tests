import { Injectable, Logger, Inject } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { Observable } from "rxjs";
import { AxiosResponse } from "axios";
import { EnvironmentConfigService } from "@common/config/environment-config.service";
import { IHeaderContextService } from "@common/interfaces/header-context.service.interface";

/**
 * Data Service Client
 * Handles communication with the data service microservice
 */
@Injectable()
export class DataServiceClient {
  private readonly logger = new Logger(DataServiceClient.name);
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject("IEnvironmentConfigService")
    private readonly environmentConfigService: EnvironmentConfigService,
    @Inject("IHeaderContextService")
    private readonly headerContextService: IHeaderContextService,
  ) {
    this.baseUrl = this.environmentConfigService.dataService?.baseUrl || "";

    if (!this.baseUrl) {
      throw new Error("DATA_SERVICE_BASE_URL environment variable is required");
    }
  }

  /**
   * Gets headers for requests with context propagation
   * @returns Headers object for the data service request
   */
  private getHeaders(): Record<string, string> {
    const baseHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    return this.headerContextService.getPropagatedHeaders(baseHeaders);
  }

  /**
   * Data Service GET request
   * @param endpoint - Endpoint API (ex: '/datasources/example')
   * @param params - Query parameters
   * @returns Observable with the API response
   */
  get<T = any>(
    endpoint: string,
    params?: Record<string, any>,
  ): Observable<AxiosResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    return this.httpService.get<T>(url, {
      headers: this.getHeaders(),
      params,
    });
  }
}
