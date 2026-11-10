import { Inject, Injectable } from "@nestjs/common";
import { IPresetConfigRepository } from "@domain/repositories/preset-config.repository.interface";
import { DatasetRepositoryFactory } from "@domain/factories/dataset-repository.factory";
import { PresetEntity } from "@domain/entities/preset.entity";

/**
 * Factory for creating PresetEntity instances
 * Loads preset configurations from files and creates entity instances
 */
@Injectable()
export class PresetFactory {
  constructor(
    @Inject("PresetConfigRepository")
    private readonly presetConfigRepository: IPresetConfigRepository,
    @Inject("DatasetRepositoryFactory")
    private readonly datasetRepositoryFactory: DatasetRepositoryFactory,
  ) {}

  /**
   * Creates a preset instance by name
   * Loads the configuration file and creates a PresetEntity instance
   * @param {string} presetName - Name of the preset (e.g., "value-creation/portfolio-performance/overview/category-growth-levers/occasions-development")
   * @returns {Promise<PresetEntity>} Promise with PresetEntity instance
   */
  async create(presetName: string): Promise<PresetEntity> {
    return new PresetEntity(
      this.datasetRepositoryFactory,
      await this.presetConfigRepository.getByName(presetName),
      presetName,
    );
  }
}
