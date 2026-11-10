import { Dataset, DatasetConfig } from "@domain/entities/common/base-config.entity";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
declare class ShowGlobalDataPresetHandler implements IPresetHandler<PresetResponse> {
    get name(): string;
    datasets(): DatasetConfig[];
    handle(preset: PresetDefinition, datasets?: Dataset[]): PresetResponse;
}
export declare const showGlobalDataHandler: ShowGlobalDataPresetHandler;
export {};
