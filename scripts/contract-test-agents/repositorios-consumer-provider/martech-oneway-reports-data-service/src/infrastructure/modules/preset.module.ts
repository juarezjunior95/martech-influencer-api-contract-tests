import { Module } from "@nestjs/common";
import { CommonModule } from "@common/common.module";
import { DatabricksModule } from "./databricks.module";
import { DatasetRepositoryFactory } from "@domain/factories/dataset-repository.factory";
import { PresetController } from "@infrastructure/controllers/preset.controller";
import { PresetFactory } from "@domain/factories/preset.factory";
import { FetchPresetUseCase } from "@application/usecases/fetch-preset.usecase";
import { PresetConfigRepository } from "@repositories/preset-config.repository";
import { CurrentUserRepository } from "@repositories/user.repository";
import { DatabricksDataRepository } from "@infrastructure/repositories/databricks-data.repository";

@Module({
  imports: [CommonModule, DatabricksModule],
  controllers: [PresetController],
  providers: [
    {
      provide: "DatabricksDataRepository",
      useClass: DatabricksDataRepository,
    },
    {
      provide: "DatasetRepositoryFactory",
      useClass: DatasetRepositoryFactory,
    },
    {
      provide: "PresetConfigRepository",
      useClass: PresetConfigRepository,
    },
    {
      provide: "PresetFactory",
      useClass: PresetFactory,
    },
    {
      provide: "IUserRepository",
      useClass: CurrentUserRepository,
    },
    {
      provide: "FetchPresetUseCase",
      useClass: FetchPresetUseCase,
    },
  ],
})
export class PresetModule {}
