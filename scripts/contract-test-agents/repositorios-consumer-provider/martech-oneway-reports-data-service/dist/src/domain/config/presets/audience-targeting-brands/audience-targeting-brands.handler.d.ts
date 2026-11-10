import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { Dataset } from "@domain/entities/common/base-config.entity";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
import { UserEntity } from "@domain/entities/user.entity";
declare class AudienceTargetingBrandsPresetHandler implements IPresetHandler<PresetResponse> {
    get name(): string;
    handle(preset: PresetDefinition, _datasets?: Dataset[], user?: UserEntity): PresetResponse;
    private defaultForFirstCountry;
    private cloneByCountry;
    private cloneRow;
}
export declare const audienceTargetingBrandsHandler: AudienceTargetingBrandsPresetHandler;
export {};
