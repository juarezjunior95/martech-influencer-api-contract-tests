import { Dataset, DatasetConfig, Filter } from "@domain/entities/common/base-config.entity";
import { PresetDefinition, PresetResponse } from "@domain/entities/preset.entity";
import { UserEntity } from "@domain/entities/user.entity";
export interface IPresetHandler<TPreset extends PresetDefinition = PresetDefinition> {
    handle(preset: TPreset, datasets?: Dataset[], user?: UserEntity): PresetResponse;
    datasets?(preset: TPreset): DatasetConfig[];
    filters?(preset: TPreset): Filter[];
}
