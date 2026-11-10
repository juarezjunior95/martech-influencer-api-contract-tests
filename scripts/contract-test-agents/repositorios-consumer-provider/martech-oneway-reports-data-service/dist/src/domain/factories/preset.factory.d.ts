import { IPresetConfigRepository } from "@domain/repositories/preset-config.repository.interface";
import { DatasetRepositoryFactory } from "@domain/factories/dataset-repository.factory";
import { PresetEntity } from "@domain/entities/preset.entity";
export declare class PresetFactory {
    private readonly presetConfigRepository;
    private readonly datasetRepositoryFactory;
    constructor(presetConfigRepository: IPresetConfigRepository, datasetRepositoryFactory: DatasetRepositoryFactory);
    create(presetName: string): Promise<PresetEntity>;
}
