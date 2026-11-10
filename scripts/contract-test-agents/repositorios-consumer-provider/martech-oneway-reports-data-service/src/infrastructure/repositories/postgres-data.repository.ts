import { Injectable, Logger, Inject } from "@nestjs/common";
import { IDataRepository } from "@domain/repositories/data.repository.interface";
import { DataItem, Filter } from "@domain/entities/datasource.entity";
import { DatabaseFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import { PostgresClient } from "@infrastructure/services/postgres.client";
import * as fs from "fs";
import * as path from "path";
import { FileLoaderService } from "@common/services/file-loader.service";

/**
 * Postgres Data Repository Implementation
 * Fetches data from Postgres using SQL files
 */
@Injectable()
export class PostgresDataRepository implements IDataRepository {
  private readonly logger = new Logger(PostgresDataRepository.name);
  private readonly cache = new Map<string, string>();
  private readonly sqlDirectory = path.join(
    process.cwd(),
    "src",
    "infrastructure",
    "sql",
    "postgres",
  );

  constructor(
    @Inject("PostgresClient")
    private readonly postgresClient: PostgresClient,
    private readonly fileLoaderService: FileLoaderService,
  ) {}

  /**
   * Fetches data from a specific data source with filters
   * @param fetchDataConfig - Database fetch data configuration (contains query and type)
   * @param filters - Array of filters to apply to the query
   * @returns Array of data items
   */
  async fetchData(
    fetchDataConfig: DatabaseFetchDataConfig,
    filters: Filter[],
  ): Promise<DataItem[]> {
    try {
      // Load SQL file for the datasource
      const sqlFilePath = path.join(
        this.sqlDirectory,
        `${fetchDataConfig.query}.sql`,
      );
      const sqlQuery = await this.fileLoaderService.load<string>(sqlFilePath);

      // Convert named parameters (:name) to positional parameters ($1, $2, etc.) based on filter order
      const { query: convertedQuery, parameters } =
        this.convertFiltersToNamedParameters(sqlQuery, filters);

      // Execute query with parameters
      const result = await this.postgresClient.executeQuery(
        convertedQuery,
        parameters,
      );

      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch data: ${error.message}`);
      throw error;
    }
  }

  /**
   * Converts SQL query with named parameters ($name) to PostgreSQL positional parameters ($1, $2, etc.)
   * Finds unique parameters in order of first appearance and replaces them sequentially
   * @param sqlQuery - SQL query with named parameters (e.g., $viewtype, $page_filter, $zone)
   * @param filters - Array of filters to map to parameters
   * @returns Object with converted SQL query and parameters array
   */
  private convertFiltersToNamedParameters(
    sqlQuery: string,
    filters: Filter[],
  ): { query: string; parameters: any[] } {
    // Create map of filter names to values
    const filterMap = new Map<string, any>();
    filters?.forEach((filter) => {
      filterMap.set(filter.name, filter.value);
    });

    // Find unique parameters in order of first appearance
    const paramNames: string[] = [];
    const regex = /\$([a-zA-Z_]\w*)/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(sqlQuery)) !== null) {
      const paramName = match[1];
      if (paramNames.includes(paramName)) {
        continue;
      }
      if (!filterMap.has(paramName)) {
        throw new Error(
          `Named parameter $${paramName} found in query but not in filters list`,
        );
      }
      paramNames.push(paramName);
    }

    // Build parameters array in the same order as found
    const parameters: any[] = [];
    let convertedQuery = sqlQuery;

    paramNames.forEach((paramName, index) => {
      const position = index + 1;
      parameters.push(filterMap.get(paramName));
      // Replace all occurrences of this parameter
      const regex = new RegExp(`\\$${paramName}\\b`, "g");
      convertedQuery = convertedQuery.replace(regex, `$${position}`);
    });

    return { query: convertedQuery, parameters };
  }

  /**
   * Loads SQL file for the specified datasource
   * Loads from cache if available, otherwise loads from filesystem and caches it
   * @param sqlFile - SQL file name without extension
   * @returns SQL query content
   */
  private async loadSqlFile(sqlFile: string): Promise<string> {
    // Check cache first
    if (this.cache.has(sqlFile)) {
      return this.cache.get(sqlFile)!;
    }

    const sqlFilePath = path.join(this.sqlDirectory, `${sqlFile}.sql`);

    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`SQL file not found: ${sqlFile}.sql`);
    }

    const sqlContent = fs.readFileSync(sqlFilePath, "utf8");

    // Cache the SQL content
    this.cache.set(sqlFile, sqlContent);

    return sqlContent;
  }
}
