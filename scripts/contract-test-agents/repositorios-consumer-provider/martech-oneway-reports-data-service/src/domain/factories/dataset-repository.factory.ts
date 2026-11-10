import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import {
  IDataRepository,
  FetchDataConfig,
} from "@domain/repositories/data.repository.interface";
import { getProcedureEnvironment } from "@domain/factories/procedure-environment";

/**
 * Repository type enum
 */
export enum RepositoryType {
  deltalake = "DatabricksDataRepository",
  database = "PostgresDataRepository",
}

/**
 * Execution modes supported by the Databricks repository
 */
export enum DeltalakeExecutionType {
  query = "query",
  procedure = "procedure",
}

/**
 * Used for datasets that fetch data from Deltalake
 */
export interface DeltalakeFetchDataConfig extends FetchDataConfig {
  query?: string;
  procedure?: string;
  parameters?: string[];
  executionType?: DeltalakeExecutionType;
  injectProcedureEnvironment?: boolean;
  type: RepositoryType.deltalake;
}

/**
 * Used for datasets that fetch data from database
 */
export interface DatabaseFetchDataConfig extends FetchDataConfig {
  query: string;
  type: RepositoryType.database;
}

/**
 * Parameters for creating a Deltalake fetch data configuration
 */
export interface CreateDeltalakeFetchDataConfigParams {
  query: string;
  injectProcedureEnvironment?: boolean;
}

const DEFAULT_DELTALAKE_RESULT_QUERY_PROCEDURE =
  "{{DATABRICKS_SCHEMA}}.owr_result_query_sp";

export interface CreateDeltalakeProcedureStatementFetchDataConfigParams {
  procedure: string;
  parameters?: string[];
}

export interface CreateDeltalakeResultQueryFetchDataConfigParams {
  functionName: string;
  parameters: string[];
  staticParams?: Record<string, string>;
}

/**
 * Parameters for creating a Database fetch data configuration
 */
export interface CreateDatabaseFetchDataConfigParams {
  query: string;
}

/**
 * Creates a Deltalake fetch data configuration
 * @param params - Configuration parameters object
 * @returns {DeltalakeFetchDataConfig} Deltalake fetch data configuration
 */
export function createDeltalakeFetchDataConfig(
  params: CreateDeltalakeFetchDataConfigParams,
): DeltalakeFetchDataConfig {
  return {
    query: params.query,
    executionType: DeltalakeExecutionType.query,
    type: RepositoryType.deltalake,
    ...(params.injectProcedureEnvironment
      ? { injectProcedureEnvironment: true }
      : {}),
  };
}

/**
 * Creates a Deltalake stored-procedure fetch data configuration that calls
 * `owr_result_query_sp` via `CALL`.
 *
 * @param params.functionName - Logical function name passed as the first SP argument.
 * @param params.parameters   - Dynamic parameter names resolved from request filters
 *   at query time (e.g. `["country", "zone", "brand"]`). Pass an empty array when
 *   all parameters should be supplied via `staticParams`.
 * @param params.staticParams - Optional key/value pairs embedded as literal strings
 *   in the JSON payload (e.g. `{ brand: "All" }`). Values are serialised with
 *   `JSON.stringify` to ensure correct escaping of special characters.
 */
export function createDeltalakeProcedureFetchDataConfig(
  params: CreateDeltalakeResultQueryFetchDataConfigParams,
): DeltalakeFetchDataConfig {
  const dynamic = params.parameters.map((p) => `"${p}": :${p}`);
  const statics = Object.entries({
    ...params.staticParams,
    environment: getProcedureEnvironment(),
  }).map(([k, v]) => `"${k}": ${JSON.stringify(v)}`);
  const payload = [...dynamic, ...statics].join(", ");

  return {
    procedure: `
        CALL ${DEFAULT_DELTALAKE_RESULT_QUERY_PROCEDURE}(
          '${params.functionName}',
          '{${payload}}'
        );
      `,
    executionType: DeltalakeExecutionType.procedure,
    type: RepositoryType.deltalake,
  };
}

/**
 * Creates a Database fetch data configuration
 * @param params - Configuration parameters object
 * @returns {DatabaseFetchDataConfig} Database fetch data configuration
 */
export function createDatabaseFetchDataConfig(
  params: CreateDatabaseFetchDataConfigParams,
): DatabaseFetchDataConfig {
  return {
    query: params.query,
    type: RepositoryType.database,
  };
}

/**
 * Factory for resolving repository factory
 */
@Injectable()
export class DatasetRepositoryFactory {
  constructor(private readonly moduleRef: ModuleRef) {}

  /**
   * Resolves the appropriate repository based on the repository type
   * @param type - Repository type
   * @returns {IDataRepository} The appropriate repository instance
   * @throws {Error} If no repository strategy found for the configuration type
   */
  public resolveRepository(type: RepositoryType): IDataRepository {
    try {
      return this.moduleRef.get<IDataRepository>(type);
    } catch (error) {
      throw new Error(
        `Failed to resolve repository: ${type} with error: ${error.message}`,
      );
    }
  }
}
