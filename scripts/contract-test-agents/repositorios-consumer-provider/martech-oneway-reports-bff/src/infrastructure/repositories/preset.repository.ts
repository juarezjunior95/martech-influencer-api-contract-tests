import { Injectable, Logger } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { IPresetRepository } from "@domain/repositories/preset.repository.interface";
import { PresetData, PresetFilter } from "@domain/entities/preset.entity";
import { DataServiceClient } from "@infrastructure/services/data-service.client";

/**
 * Fetches preset data from the Data-Service. Reuses the existing
 * DataServiceClient so `Authorization` and trace headers propagate
 * without any additional wiring.
 */
@Injectable()
export class PresetRepository implements IPresetRepository {
  private readonly logger = new Logger(PresetRepository.name);

  constructor(private readonly dataServiceClient: DataServiceClient) {}

  async getPreset(
    presetRef: string,
    filters?: PresetFilter[],
  ): Promise<PresetData> {
    try {
      const queryParams = this.convertFiltersToQueryParams(filters);
      const response = await firstValueFrom(
        this.dataServiceClient.get<{ name: string; data: PresetData }>(
          `/presets/${presetRef}`,
          queryParams,
        ),
      );
      return response.data?.data ?? {};
    } catch (error) {
      this.logger.error(
        `Failed to fetch preset '${presetRef}': ${error.message}`,
      );
      throw error;
    }
  }

  private convertFiltersToQueryParams(
    filters?: PresetFilter[],
  ): Record<string, string | number | boolean> {
    if (!filters?.length) return {};
    const params: Record<string, string | number | boolean> = {};
    for (const filter of filters) {
      // Skip filters with an empty name — the namespaced query shape
      // `<namespace>[]=<value>` would be malformed and the data-service
      // wouldn't be able to map them onto a preset key anyway.
      if (!filter.name) continue;
      const namespace = filter.namespace ?? "filter";
      params[`${namespace}[${filter.name}]`] = filter.value;
    }
    return params;
  }
}
