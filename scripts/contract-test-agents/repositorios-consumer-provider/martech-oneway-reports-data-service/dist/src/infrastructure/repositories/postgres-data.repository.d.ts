import { IDataRepository } from "@domain/repositories/data.repository.interface";
import { DataItem, Filter } from "@domain/entities/datasource.entity";
import { DatabaseFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { PostgresClient } from "@infrastructure/services/postgres.client";
import { FileLoaderService } from "@common/services/file-loader.service";
export declare class PostgresDataRepository implements IDataRepository {
    private readonly postgresClient;
    private readonly fileLoaderService;
    private readonly logger;
    private readonly cache;
    private readonly sqlDirectory;
    constructor(postgresClient: PostgresClient, fileLoaderService: FileLoaderService);
    fetchData(fetchDataConfig: DatabaseFetchDataConfig, filters: Filter[]): Promise<DataItem[]>;
    private convertFiltersToNamedParameters;
    private loadSqlFile;
}
