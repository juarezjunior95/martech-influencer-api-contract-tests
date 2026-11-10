import { PresetFilterDto } from "./dto/preset-filter.dto";
import { IProcessPresetUseCase } from "../../application/interfaces/process-preset.usecase.interface";
export declare class PresetController {
    private readonly processPresetUseCase;
    private readonly logger;
    constructor(processPresetUseCase: IProcessPresetUseCase);
    getPreset(preset: string, filters: PresetFilterDto): Promise<import("../../domain/entities/preset.entity").ProcessedPresetResult>;
}
