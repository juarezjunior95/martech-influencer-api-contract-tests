import { Dataset, DatasetConfig } from "@domain/entities/common/base-config.entity";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
declare class KpiGroupHandler implements IPresetHandler<PresetResponse> {
    get name(): string;
    datasets(): DatasetConfig[];
    handle(preset: PresetDefinition, datasets?: Dataset[]): PresetResponse;
    private extractRows;
    private buildMap;
    private toConfigValue;
    private pick;
}
export declare const kpiGroupHandler: KpiGroupHandler;
export {};
