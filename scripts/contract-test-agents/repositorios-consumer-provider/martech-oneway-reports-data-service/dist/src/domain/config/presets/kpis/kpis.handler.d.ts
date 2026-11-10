import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
declare class KpisPresetHandler implements IPresetHandler<PresetResponse> {
    get name(): string;
    handle(preset: PresetDefinition): PresetResponse;
    private pickDefaultKpi;
    private normalizeKpiGroups;
}
export declare const kpisHandler: KpisPresetHandler;
export {};
