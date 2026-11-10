import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { isAxiosError } from "axios";
import { firstValueFrom } from "rxjs";
import { DataServiceClient } from "@infrastructure/services/data-service.client";

@Injectable()
export class ImagesProxyService {
  private readonly logger = new Logger(ImagesProxyService.name);

  constructor(private readonly dataServiceClient: DataServiceClient) {}

  async proxyBrand(query: {
    name?: string;
    format: "table" | "square";
    brand_family?: string;
  }) {
    try {
      const response = await firstValueFrom(
        this.dataServiceClient.get("/images/brand", {
          name: query.name,
          format: query.format,
          brand_family: query.brand_family,
        }),
      );
      return response.data;
    } catch (error) {
      this.rethrowUpstream(error, "brand");
    }
  }

  async proxyCountry(query: { name?: string; format: "icon" | "waving" }) {
    try {
      const response = await firstValueFrom(
        this.dataServiceClient.get("/images/country", {
          name: query.name,
          format: query.format,
        }),
      );
      return response.data;
    } catch (error) {
      this.rethrowUpstream(error, "country");
    }
  }

  private rethrowUpstream(error: unknown, resource: string): never {
    if (isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      throw new HttpException(
        typeof data === "object" && data !== null
          ? data
          : { message: String(data) },
        status,
      );
    }

    this.logger.error(
      `Images proxy (${resource}) failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    throw new HttpException("Data service unavailable", HttpStatus.BAD_GATEWAY);
  }
}
