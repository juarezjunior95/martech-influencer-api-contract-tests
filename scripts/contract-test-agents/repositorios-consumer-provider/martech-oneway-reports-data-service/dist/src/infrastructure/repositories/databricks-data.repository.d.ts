import { IDataRepository } from "@domain/repositories/data.repository.interface";
import { EntityClass, Filter } from "@domain/entities/datasource.entity";
import { DeltalakeFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { DatabricksClient } from "@infrastructure/services/databricks.client";
import { EnvironmentConfigService } from "@common/config/environment-config.service";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { FileLoaderService } from "@common/services/file-loader.service";
export declare class DatabricksDataRepository implements IDataRepository {
    private readonly databricksClient;
    private readonly envConfigService;
    private readonly fileLoaderService;
    private readonly logger;
    private readonly cache;
    private readonly sqlDirectory;
    constructor(databricksClient: DatabricksClient, envConfigService: EnvironmentConfigService, fileLoaderService: FileLoaderService);
    fetchData(fetchDataConfig: DeltalakeFetchDataConfig, filters: Filter[], entityClass?: EntityClass): Promise<KpiEntity[]>;
    private resolveStatement;
    private shouldExecuteProcedure;
    private retainProcedureParameters;
    private buildProcedureStatement;
    private inlineStatementParameters;
    private toQuotedSqlString;
    private applyProcedureEnvironmentParameter;
    private convertFiltersToNamedParameters;
    private replacePlaceholders;
}
