import { Inject, Injectable, Logger } from "@nestjs/common";
import newrelic from "newrelic";
import { IProcessPresetUseCase } from "../interfaces/process-preset.usecase.interface";
import { PROCESS_PRESET_USE_CASE } from "./tokens";
import { IPresetCacheRepository } from "@domain/repositories/preset-cache.repository.interface";
import { IUserRepository } from "@domain/repositories/user.repository.interface";
import { EnvironmentConfigService } from "@common/config/environment-config.service";
import {
  Preset,
  PresetFilter,
  ProcessedPresetResult,
} from "@domain/entities/preset.entity";

/**
 * Caching decorator over ProcessPresetUseCase. The cache key includes
 * the resolved user (see PresetCacheRepository), so different users
 * never share a filtered response.
 */
@Injectable()
export class CachedProcessPresetUseCase implements IProcessPresetUseCase {
  private readonly logger = new Logger(CachedProcessPresetUseCase.name);

  constructor(
    @Inject(PROCESS_PRESET_USE_CASE)
    private readonly processPresetUseCase: IProcessPresetUseCase,
    @Inject("IPresetCacheRepository")
    private readonly presetCacheRepository: IPresetCacheRepository,
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository,
    @Inject("IEnvironmentConfigService")
    private readonly environmentConfig: EnvironmentConfigService,
  ) {}

  async execute(
    presetName: string,
    filters?: PresetFilter[],
  ): Promise<ProcessedPresetResult> {
    const preset = await this.processPresetUseCase.createPresetEntity(
      presetName,
      filters,
    );

    const cacheConfig = preset.getCacheConfig();
    const cacheFeatureEnabled =
      this.environmentConfig.presetCache?.enabled ??
      this.environmentConfig.viewCache.enabled;

    if (!cacheFeatureEnabled || !cacheConfig.enabled) {
      newrelic.addCustomAttribute("preset.cache.hit", false);
      return this.processPresetUseCase.processPresetEntity(preset);
    }

    const user = await this.userRepository.getCurrentUser();
    const cached = await this.presetCacheRepository.getPreset(preset, user);
    if (cached) {
      newrelic.addCustomAttribute("preset.cache.hit", true);
      this.logger.log(`Cache hit for preset '${presetName}'`);
      return cached;
    }

    newrelic.addCustomAttribute("preset.cache.hit", false);

    const result = await this.processPresetUseCase.processPresetEntity(preset);
    const saved = await this.presetCacheRepository.setPreset(
      preset,
      user,
      result,
    );
    this.logger.log(
      `Preset '${presetName}' processed${saved ? " and cached" : " (cache not saved)"}`,
    );
    return result;
  }

  async createPresetEntity(
    presetName: string,
    filters?: PresetFilter[],
  ): Promise<Preset> {
    return this.processPresetUseCase.createPresetEntity(presetName, filters);
  }

  async processPresetEntity(preset: Preset): Promise<ProcessedPresetResult> {
    return this.processPresetUseCase.processPresetEntity(preset);
  }
}
