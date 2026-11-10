import { Dataset, DatasetConfig } from "@domain/entities/common/base-config.entity";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { UserEntity } from "@domain/entities/user.entity";
declare class BrandFilterHandler implements IPresetHandler<PresetResponse> {
    get name(): string;
    datasets(): DatasetConfig[];
    handle(preset: PresetDefinition, datasets?: Dataset[], user?: UserEntity): PresetResponse;
    private extractRows;
    private buildValues;
}
export declare const brandsHandler: BrandFilterHandler;
export {};
