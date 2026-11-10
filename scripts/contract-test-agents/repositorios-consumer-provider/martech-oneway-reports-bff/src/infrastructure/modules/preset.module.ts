import { Module } from "@nestjs/common";
import { CommonModule } from "@common/common.module";
import { PresetController } from "@infrastructure/controllers/preset.controller";
import { ProcessPresetUseCase } from "@application/usecases/process-preset.usecase";
import { CachedProcessPresetUseCase } from "@application/usecases/cached-process-preset.usecase";
import {
  CACHED_PROCESS_PRESET_USE_CASE,
  PROCESS_PRESET_USE_CASE,
} from "@application/usecases/tokens";
import { PresetConfigRepository } from "@infrastructure/repositories/preset-config.repository";
import { PresetRepository } from "@infrastructure/repositories/preset.repository";
import { PresetCacheRepository } from "@infrastructure/repositories/preset-cache.repository";
import { PresetFormatterRepository } from "@infrastructure/repositories/preset-formatter.repository";
import { CurrentUserRepository } from "@infrastructure/repositories/user.repository";
import { DataServiceClient } from "@infrastructure/services/data-service.client";
import { RedisModule } from "@infrastructure/modules/redis.module";

@Module({
  imports: [CommonModule, RedisModule],
  controllers: [PresetController],
  providers: [
    { provide: "IPresetConfigRepository", useClass: PresetConfigRepository },
    { provide: "IPresetRepository", useClass: PresetRepository },
    { provide: "IPresetCacheRepository", useClass: PresetCacheRepository },
    {
      provide: "IPresetFormatterRepository",
      useClass: PresetFormatterRepository,
    },
    { provide: "IUserRepository", useClass: CurrentUserRepository },
    DataServiceClient,
    { provide: PROCESS_PRESET_USE_CASE, useClass: ProcessPresetUseCase },
    {
      provide: CACHED_PROCESS_PRESET_USE_CASE,
      useClass: CachedProcessPresetUseCase,
    },
  ],
  exports: [
    "IPresetConfigRepository",
    "IPresetRepository",
    "IPresetCacheRepository",
    "IPresetFormatterRepository",
    PROCESS_PRESET_USE_CASE,
    CACHED_PROCESS_PRESET_USE_CASE,
  ],
})
export class PresetModule {}
