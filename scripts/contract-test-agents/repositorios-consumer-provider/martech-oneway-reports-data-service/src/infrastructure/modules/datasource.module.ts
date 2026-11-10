import { Module } from "@nestjs/common";
import { DataSourceController } from "@infrastructure/controllers/datasource.controller";
import { FetchDataSourceUseCase } from "@application/usecases/fetch-datasource.usecase";
import { PostgresDataRepository } from "@infrastructure/repositories/postgres-data.repository";
import { DatabricksDataRepository } from "@infrastructure/repositories/databricks-data.repository";
import { DatasourceConfigRepository } from "@infrastructure/repositories/datasource-config.repository";
import { CommonModule } from "@common/common.module";
import { PostgresModule } from "./postgres.module";
import { DatabricksModule } from "./databricks.module";
import { DatasourceFactory } from "@domain/factories/datasource.factory";
import { DatasetRepositoryFactory } from "@domain/factories/dataset-repository.factory";

@Module({
  imports: [CommonModule, PostgresModule, DatabricksModule],
  controllers: [DataSourceController],
  providers: [
    {
      provide: "PostgresDataRepository",
      useClass: PostgresDataRepository,
    },
    {
      provide: "DatabricksDataRepository",
      useClass: DatabricksDataRepository,
    },
    {
      provide: "DatasetRepositoryFactory",
      useClass: DatasetRepositoryFactory,
    },
    {
      provide: "DatasourceConfigRepository",
      useClass: DatasourceConfigRepository,
    },
    {
      provide: "DatasourceFactory",
      useClass: DatasourceFactory,
    },
    {
      provide: "FetchDataSourceUseCase",
      useClass: FetchDataSourceUseCase,
    },
  ],
})
export class DataSourceModule {}
