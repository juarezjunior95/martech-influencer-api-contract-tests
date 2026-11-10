import { Module } from "@nestjs/common";
import { CommonModule } from "@common/common.module";
import { ViewController } from "@infrastructure/controllers/view.controller";
import { ProcessViewUseCase } from "@application/usecases/process-view.usecase";
import { CachedProcessViewUseCase } from "@application/usecases/cached-process-view.usecase";
import { ClearCacheUseCase } from "@application/usecases/clear-cache.usecase";
import { DataRepository } from "@infrastructure/repositories/datasource.repository";
import { FormatterRepository } from "@infrastructure/repositories/formatter.repository";
import { ViewConfigRepository } from "@infrastructure/repositories/view-config.repository";
import { ViewCacheRepository } from "@infrastructure/repositories/view-cache.repository";
import { CurrentUserRepository } from "@infrastructure/repositories/user.repository";
import { DataServiceClient } from "@infrastructure/services/data-service.client";
import { RedisModule } from "@infrastructure/modules/redis.module";
import { PresetCacheRepository } from "@infrastructure/repositories/preset-cache.repository";

@Module({
  imports: [CommonModule, RedisModule],
  controllers: [ViewController],
  providers: [
    // Repositories
    {
      provide: "IDataRepository",
      useClass: DataRepository,
    },
    {
      provide: "IViewConfigRepository",
      useClass: ViewConfigRepository,
    },
    {
      provide: "IFormatterRepository",
      useClass: FormatterRepository,
    },
    {
      provide: "IViewCacheRepository",
      useClass: ViewCacheRepository,
    },
    {
      provide: "IPresetCacheRepository",
      useClass: PresetCacheRepository,
    },
    {
      provide: "IUserRepository",
      useClass: CurrentUserRepository,
    },
    // Services
    DataServiceClient,
    // Use Cases
    {
      provide: "IProcessViewUseCase",
      useClass: ProcessViewUseCase, // Original use case without cache
    },
    {
      provide: "ICachedProcessViewUseCase",
      useClass: CachedProcessViewUseCase, // Use case with cache (decorator pattern)
    },
    {
      provide: "ClearCacheUseCase",
      useClass: ClearCacheUseCase,
    },
  ],
  exports: [
    "IDataRepository",
    "IViewConfigRepository",
    "IFormatterRepository",
    "IViewCacheRepository",
    "IUserRepository",
    "IProcessViewUseCase",
    "ICachedProcessViewUseCase",
  ],
})
export class ViewModule {}
