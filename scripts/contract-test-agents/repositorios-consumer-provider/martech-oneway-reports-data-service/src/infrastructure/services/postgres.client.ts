import { Injectable, Inject, Logger } from "@nestjs/common";
import { Pool } from "pg";

/**
 * Postgres Client
 * Postgres database operations
 */
@Injectable()
export class PostgresClient {
  private readonly logger = new Logger(PostgresClient.name);

  constructor(@Inject("POSTGRES_POOL") private readonly pool: Pool) {}

  /**
   * Executes a SQL query with parameters and returns the results
   * @param query - SQL query to execute
   * @param parameters - Parameters for the query
   * @returns Query result with rows
   */
  async executeQuery(query: string, parameters?: any[]): Promise<any[]> {
    try {
      const result = await this.pool.query(query, parameters);
      return result.rows;
    } catch (error) {
      this.logger.error(`Query failed: ${error.message}`);
      throw error;
    }
  }
}
