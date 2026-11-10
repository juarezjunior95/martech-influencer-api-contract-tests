import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
declare class InnovationHubWaterfallDimensionsPresetHandler implements IPresetHandler<PresetResponse> {
    get name(): string;
    handle(preset: PresetDefinition): PresetResponse;
}
export declare const innovationHubWaterfallDimensionsHandler: InnovationHubWaterfallDimensionsPresetHandler;
export {};
