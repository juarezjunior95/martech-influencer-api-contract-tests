import { Dataset, DatasetConfig } from "@domain/entities/common/base-config.entity";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { UserEntity } from "@domain/entities/user.entity";
declare class ZonesFilterHandler implements IPresetHandler<PresetResponse> {
    get name(): string;
    datasets(preset: PresetDefinition): DatasetConfig[];
    handle(preset: PresetDefinition, datasets?: Dataset[], user?: UserEntity): PresetResponse;
    private buildValues;
}
export declare const zonesHandler: ZonesFilterHandler;
export {};
