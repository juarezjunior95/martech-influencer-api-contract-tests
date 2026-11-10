import { IPresetRepository } from "../../domain/repositories/preset.repository.interface";
import { PresetData, PresetFilter } from "../../domain/entities/preset.entity";
import { DataServiceClient } from "../services/data-service.client";
export declare class PresetRepository implements IPresetRepository {
    private readonly dataServiceClient;
    private readonly logger;
    constructor(dataServiceClient: DataServiceClient);
    getPreset(presetRef: string, filters?: PresetFilter[]): Promise<PresetData>;
    private convertFiltersToQueryParams;
}
