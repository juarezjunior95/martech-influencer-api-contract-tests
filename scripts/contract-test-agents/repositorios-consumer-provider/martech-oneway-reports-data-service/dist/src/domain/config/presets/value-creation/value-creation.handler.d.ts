import { Dataset, DatasetConfig } from "@domain/entities/common/base-config.entity";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { UserEntity } from "@domain/entities/user.entity";
declare class ValueCreationPresetHandler implements IPresetHandler<PresetResponse> {
    get name(): string;
    datasets(): DatasetConfig[];
    handle(preset: PresetDefinition, datasets?: Dataset[], user?: UserEntity): PresetResponse;
    private extractRows;
    private buildMockData;
    private extractCountries;
    private rowVisibleForUser;
    private initializeCountriesArray;
    private extractZones;
    private buildPeriods;
}
export declare const valueCreationHandler: ValueCreationPresetHandler;
export {};
