import { FetchPresetUseCase } from "@application/usecases/fetch-preset.usecase";
import { PresetFilterDto } from "@infrastructure/controllers/dto/preset-filter.dto";
export declare class PresetController {
    private readonly fetchPresetUseCase;
    private readonly logger;
    constructor(fetchPresetUseCase: FetchPresetUseCase);
    getPreset(name: string, filters: PresetFilterDto): Promise<{
        name: string;
        data: import("../../domain/entities/preset.entity").PresetResponse;
    }>;
}
