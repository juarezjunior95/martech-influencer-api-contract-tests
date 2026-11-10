import { Inject, Injectable, Logger } from "@nestjs/common";
import { IDataRepository } from "@domain/repositories/data.repository.interface";
import { EntityClass, Filter } from "@domain/entities/datasource.entity";
import {
  DeltalakeExecutionType,
  DeltalakeFetchDataConfig,
} from "@domain/factories/dataset-repository.factory";
import { getProcedureEnvironment } from "@domain/factories/procedure-environment";
import { DatabricksClient } from "@infrastructure/services/databricks.client";
import * as path from "path";
import { DBSQLParameter } from "@databricks/sql";
import { EnvironmentConfigService } from "@common/config/environment-config.service";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { FileLoaderService } from "@common/services/file-loader.service";
import { normalizePeriodFilterValue } from "@common/utils/period.utils";

/**
 * Databricks Data Repository Implementation
 * Fetches data from Databricks using SQL files or stored procedures
 */
@Injectable()
export class DatabricksDataRepository implements IDataRepository {
  private readonly logger = new Logger(DatabricksDataRepository.name);
  private readonly cache = new Map<string, string>();
  private readonly sqlDirectory = path.join(
    process.cwd(),
    "src",
    "infrastructure",
    "sql",
    "databricks",
  );

  constructor(
    @Inject("DatabricksClient")
    private readonly databricksClient: DatabricksClient,
    private readonly envConfigService: EnvironmentConfigService,
    private readonly fileLoaderService: FileLoaderService,
  ) {}

  /**
   * Fetches data from a specific data source with filters
   * @param fetchDataConfig - Deltalake fetch data configuration (contains query/procedure and type)
   * @param filters - Array of filters to apply to the query
   * @param entityClass
   * @returns Array of data items
   */
  async fetchData(
    fetchDataConfig: DeltalakeFetchDataConfig,
    filters: Filter[],
    entityClass?: EntityClass,
  ): Promise<KpiEntity[]> {
    try {
      // Convert filters to named parameters
      const namedParameters = this.convertFiltersToNamedParameters(filters);
      this.applyProcedureEnvironmentParameter(fetchDataConfig, namedParameters);

      // Resolve either a SQL-file query or a stored procedure CALL statement.
      // Procedure configs may inline some filter values directly into the text,
      // and therefore mutate `namedParameters` to remove the ones that have
      // been inlined so the driver does not reject them as unused.
      const sqlQuery = await this.resolveStatement(
        fetchDataConfig,
        namedParameters,
        filters,
      );

      const queryParameters = this.shouldExecuteProcedure(fetchDataConfig)
        ? this.retainProcedureParameters(fetchDataConfig, namedParameters)
        : namedParameters;

      const result = await this.databricksClient.executeQuery(
        sqlQuery,
        queryParameters,
      );

      // Map results to entity class if provided
      if (entityClass) return result.map((r) => new entityClass(r));
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch data: ${error.message}`);
      throw error;
    }
  }

  /**
   * Resolves the executable Databricks statement from the datasource config.
   * Query configs keep loading `.sql` files, while procedure configs build a
   * CALL statement using the same named parameters already used by queries.
   */
  private async resolveStatement(
    fetchDataConfig: DeltalakeFetchDataConfig,
    namedParameters: Record<string, DBSQLParameter>,
    filters: Filter[],
  ): Promise<string> {
    if (this.shouldExecuteProcedure(fetchDataConfig)) {
      return this.buildProcedureStatement(
        fetchDataConfig,
        namedParameters,
        filters,
      );
    }

    if (!fetchDataConfig.query) {
      throw new Error("Databricks datasource config must define a query");
    }

    const sqlFilePath = path.join(
      this.sqlDirectory,
      `${fetchDataConfig.query}.sql`,
    );
    const sqlFile = await this.fileLoaderService.load<string>(sqlFilePath);

    return this.replacePlaceholders(sqlFile);
  }

  /**
   * Databricks procedure configs can be declared explicitly via
   * `executionType: "procedure"` or implicitly by providing `procedure`.
   */
  private shouldExecuteProcedure(
    fetchDataConfig: DeltalakeFetchDataConfig,
  ): boolean {
    return (
      fetchDataConfig.executionType === DeltalakeExecutionType.procedure ||
      Boolean(fetchDataConfig.procedure)
    );
  }

  /**
   * Keeps only parameters that can still be consumed by a procedure call.
   *
   * A dataset may explicitly declare its procedure parameters while the
   * request carries filters for other datasets as well. Only configurations
   * that opt in with this allow-list drop those unrelated named parameters.
   */
  private retainProcedureParameters(
    fetchDataConfig: DeltalakeFetchDataConfig,
    namedParameters: Record<string, DBSQLParameter>,
  ): Record<string, DBSQLParameter> {
    if (!fetchDataConfig.parameters) return namedParameters;

    const parameterNames = new Set(fetchDataConfig.parameters);

    return Object.fromEntries(
      Object.entries(namedParameters).filter(([name]) =>
        parameterNames.has(name),
      ),
    );
  }

  /**
   * Builds a Databricks CALL statement.
   *
   * Supported configs:
   * - `procedure: "catalog.schema.my_proc", parameters: ["country"]`
   * - `procedure: "catalog.schema.my_proc(:country)"`
   * - `procedure: "CALL catalog.schema.my_proc(:country)"`
   */
  private buildProcedureStatement(
    fetchDataConfig: DeltalakeFetchDataConfig,
    namedParameters: Record<string, DBSQLParameter>,
    filters: Filter[],
  ): string {
    if (!fetchDataConfig.procedure) {
      throw new Error("Databricks procedure config must define a procedure");
    }

    const procedure = this.replacePlaceholders(
      fetchDataConfig.procedure.trim(),
    );

    // Inline `:<name>` markers with JSON-encoded, SQL-safe string values from the
    // request filters. We do this only for procedures because Databricks does
    // not bind named parameters that appear inside a SQL string literal (e.g.
    // a JSON payload like `'{"dt_end": :dt_end}'`).
    const inlinedProcedure = this.inlineStatementParameters(
      procedure,
      filters,
      namedParameters,
    );

    if (/^CALL\s+/i.test(inlinedProcedure)) {
      return inlinedProcedure;
    }

    if (/\([^)]*\)\s*;?$/.test(inlinedProcedure)) {
      return `CALL ${inlinedProcedure}`;
    }

    const procedureName = inlinedProcedure.replace(/;$/, "");
    const parameterNames =
      fetchDataConfig.parameters ?? Object.keys(namedParameters);
    const parameterMarkers = parameterNames
      .map((parameterName) => `:${parameterName}`)
      .join(", ");

    return `CALL ${procedureName}(${parameterMarkers})`;
  }

  /**
   * Replaces `:<filterName>` occurrences in a statement config with JSON-encoded
   * filter values safe to embed in a single-quoted SQL string literal.
   *
   * This is required because Databricks does not bind named parameters that
   * appear inside a SQL string literal (e.g. a JSON argument passed to a
   * stored procedure). All filter values are treated as strings, per the
   * current procedure contract.
   *
   * Any filter that gets inlined is also removed from `namedParameters` so the
   * driver does not reject it as an unused parameter.
   *
   * Markers that are not present in `filters` are left untouched, allowing the
   * normal Databricks named-parameter binding to handle them downstream.
   *
   * Only markers inside a single-quoted JSON payload are supported — that is
   * the shape every datasource config builds (see
   * `createDeltalakeProcedureFetchDataConfig`). A marker used as a bare
   * procedure argument (`my_proc(:country)`) receives the same two-layer
   * encoding, so values containing `"` or `\` would reach the procedure still
   * escaped.
   */
  private inlineStatementParameters(
    statement: string,
    filters: Filter[],
    namedParameters: Record<string, DBSQLParameter>,
  ): string {
    if (!filters || filters.length === 0) {
      return statement;
    }

    const filterValuesByName = new Map<string, string>(
      filters.map((filter) => [
        filter.name,
        filter.name === "period"
          ? normalizePeriodFilterValue(filter.value)
          : String(filter.value),
      ]),
    );

    return statement.replace(/:(\w+)/g, (marker, name: string) => {
      if (!filterValuesByName.has(name)) {
        return marker;
      }

      delete namedParameters[name];
      return this.toQuotedSqlString(filterValuesByName.get(name) as string);
    });
  }

  /**
   * Builds a JSON string literal for a filter value inlined into a single-quoted
   * SQL payload (e.g. `owr_result_query_sp` JSON argument).
   *
   * The value crosses two parsers:
   *
   * 1. `JSON.stringify` encodes the business value as valid JSON.
   * 2. The JSON text is embedded in a Databricks SQL string literal, so each
   *    JSON backslash is escaped once more for the SQL parser. Apostrophes
   *    are escaped for the outer SQL literal as well.
   *
   * The stored procedure still receives the original business value. For a
   * value containing `"Socios"`, `JSON.stringify` produces `\"Socios\"` and the
   * SQL text carries `\\"Socios\\"`, so the SQL parser collapses each `\\` back
   * to `\` and leaves `\"Socios\"` for the JSON parser.
   *
   * This encoding assumes the marker sits inside a single-quoted SQL literal
   * (see `inlineStatementParameters`).
   */
  private toQuotedSqlString(value: string): string {
    return JSON.stringify(value)
      .replaceAll("\\", "\\\\")
      .replaceAll("'", "\\'");
  }

  /**
   * Injects `environment` from deployment config when the datasource opts in.
   * Request filters are ignored for this parameter, matching stored-procedure behavior.
   */
  private applyProcedureEnvironmentParameter(
    fetchDataConfig: DeltalakeFetchDataConfig,
    namedParameters: Record<string, DBSQLParameter>,
  ): void {
    if (!fetchDataConfig.injectProcedureEnvironment) {
      return;
    }

    namedParameters.environment = new DBSQLParameter({
      value: getProcedureEnvironment(),
    });
  }

  /**
   * Converts filters to named parameters for Databricks
   * @param filters - Array of filters to convert
   * @returns Named parameters object
   */
  private convertFiltersToNamedParameters(
    filters: Filter[],
  ): Record<string, DBSQLParameter> {
    if (!filters || filters.length === 0) {
      return {};
    }

    const namedParameters: Record<string, DBSQLParameter> = {};

    filters.forEach((filter) => {
      namedParameters[filter.name] = new DBSQLParameter({
        value:
          filter.name === "period"
            ? normalizePeriodFilterValue(filter.value)
            : filter.value,
      });
    });

    return namedParameters;
  }

  /**
   * Replaces {{PLACEHOLDER}} patterns in SQL content with environment-specific values.
   * @param sqlContent
   * @returns SQL content with replaced values
   */
  private replacePlaceholders(sqlContent: string): string {
    const placeholders = this.envConfigService.databricks.sqlPlaceholders;

    return sqlContent.replace(/\{\{(\w+)}}/g, (placeholder, name) => {
      if (!(name in placeholders)) {
        this.logger.warn(`Unknown placeholder: ${name}`);
      }
      return placeholders[name] ?? placeholder;
    });
  }
}
