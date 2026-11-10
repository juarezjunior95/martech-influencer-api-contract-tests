import { ModuleRef } from "@nestjs/core";
import { IDataRepository, FetchDataConfig } from "@domain/repositories/data.repository.interface";
export declare enum RepositoryType {
    deltalake = "DatabricksDataRepository",
    database = "PostgresDataRepository"
}
export declare enum DeltalakeExecutionType {
    query = "query",
    procedure = "procedure"
}
export interface DeltalakeFetchDataConfig extends FetchDataConfig {
    query?: string;
    procedure?: string;
    parameters?: string[];
    executionType?: DeltalakeExecutionType;
    injectProcedureEnvironment?: boolean;
    type: RepositoryType.deltalake;
}
export interface DatabaseFetchDataConfig extends FetchDataConfig {
    query: string;
    type: RepositoryType.database;
}
export interface CreateDeltalakeFetchDataConfigParams {
    query: string;
    injectProcedureEnvironment?: boolean;
}
export interface CreateDeltalakeProcedureStatementFetchDataConfigParams {
    procedure: string;
    parameters?: string[];
}
export interface CreateDeltalakeResultQueryFetchDataConfigParams {
    functionName: string;
    parameters: string[];
    staticParams?: Record<string, string>;
}
export interface CreateDatabaseFetchDataConfigParams {
    query: string;
}
export declare function createDeltalakeFetchDataConfig(params: CreateDeltalakeFetchDataConfigParams): DeltalakeFetchDataConfig;
export declare function createDeltalakeProcedureFetchDataConfig(params: CreateDeltalakeResultQueryFetchDataConfigParams): DeltalakeFetchDataConfig;
export declare function createDatabaseFetchDataConfig(params: CreateDatabaseFetchDataConfigParams): DatabaseFetchDataConfig;
export declare class DatasetRepositoryFactory {
    private readonly moduleRef;
    constructor(moduleRef: ModuleRef);
    resolveRepository(type: RepositoryType): IDataRepository;
}
