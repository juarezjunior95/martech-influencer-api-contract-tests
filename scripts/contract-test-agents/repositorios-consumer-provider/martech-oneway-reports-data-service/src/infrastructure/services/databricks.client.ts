import { Injectable, Logger } from "@nestjs/common";
import { DBSQLClient, DBSQLParameter } from "@databricks/sql";
import { EnvironmentConfigService } from "@common/config/environment-config.service";
import IDBSQLSession from "@databricks/sql/dist/contracts/IDBSQLSession";
import IDBSQLClient from "@databricks/sql/dist/contracts/IDBSQLClient";

/**
 * Databricks Client
 * Handles connections and queries to Databricks SQL warehouses
 */
@Injectable()
export class DatabricksClient {
  private readonly logger = new Logger(DatabricksClient.name);
  private readonly host: string;
  private readonly path: string;
  private readonly catalog: string;
  private readonly schema: string;
  private readonly azureTenantId: string;
  private readonly oauthClientId: string;
  private readonly oauthClientSecret: string;
  private session: IDBSQLSession | null = null;
  private connection: IDBSQLClient | null = null;
  private sessionCreationPromise: Promise<IDBSQLSession> | null = null;

  constructor(
    private readonly environmentConfigService: EnvironmentConfigService,
  ) {
    this.host = this.environmentConfigService.databricks?.host || "";
    this.path = this.environmentConfigService.databricks?.path || "";
    this.catalog = this.environmentConfigService.databricks?.catalog || "";
    this.schema = this.environmentConfigService.databricks?.schema || "";
    this.azureTenantId =
      this.environmentConfigService.databricks?.azureTenantId || "";
    this.oauthClientId =
      this.environmentConfigService.databricks?.oauthClientId || "";
    this.oauthClientSecret =
      this.environmentConfigService.databricks?.oauthClientSecret || "";

    if (!this.host) {
      throw new Error(
        "DATABRICKS_SERVER_HOSTNAME environment variable is required",
      );
    }
    if (!this.path) {
      throw new Error("DATABRICKS_HTTP_PATH environment variable is required");
    }
    if (!this.catalog) {
      throw new Error("DATABRICKS_CATALOG environment variable is required");
    }
    if (!this.schema) {
      throw new Error("DATABRICKS_SCHEMA environment variable is required");
    }
    if (!this.azureTenantId) {
      throw new Error(
        "DATABRICKS_AZURE_TENANT_ID environment variable is required",
      );
    }
    if (!this.oauthClientId) {
      throw new Error(
        "DATABRICKS_OAUTH_CLIENT_ID environment variable is required",
      );
    }
    if (!this.oauthClientSecret) {
      throw new Error(
        "DATABRICKS_OAUTH_CLIENT_SECRET environment variable is required",
      );
    }
  }

  /**
   * Gets or creates session
   * @returns Session
   */
  private async getSession(): Promise<any> {
    // Try to reuse existing session
    if (this.session) {
      this.logger.log("Reusing existing session");
      return this.session;
    }

    // If a session creation is already in progress, wait for it
    if (this.sessionCreationPromise) {
      this.logger.log("Waiting for session creation in progress");
      return await this.sessionCreationPromise;
    }

    // Create new session and store the promise so concurrent requests can wait
    this.sessionCreationPromise = this.createNewSession()
      .then((session) => {
        // Clear the promise after successful creation
        this.sessionCreationPromise = null;
        return session;
      })
      .catch((error) => {
        // Clear the promise on error so we can retry
        this.sessionCreationPromise = null;
        throw error;
      });

    return await this.sessionCreationPromise;
  }

  /**
   * Creates new session
   * @returns Session
   */
  private async createNewSession(): Promise<any> {
    // Close existing session and connection if any
    await this.closeConnection();

    // Create new connection and session
    const client = new DBSQLClient();
    const connectOptions = {
      authType: "databricks-oauth" as const,
      host: this.host,
      path: this.path,
      azureTenantId: this.azureTenantId,
      useDatabricksOAuthInAzure: true,
      oauthClientId: this.oauthClientId,
      oauthClientSecret: this.oauthClientSecret,
    };

    this.logger.log("Creating new connection to Databricks");
    const connection = await client.connect(connectOptions);
    const session = await connection.openSession({
      initialCatalog: this.catalog,
      initialSchema: this.schema,
      ...this.environmentConfigService.databricks.sessionConfig,
    });

    // Store connection and session for reuse
    this.connection = connection;
    this.session = session;

    this.logger.log("New session created");
    return session;
  }

  /**
   * Executes a SQL query with named parameters and returns the results
   * @param query - SQL query to execute
   * @param namedParameters - Named parameters for the query
   * @returns Array of query results
   */
  async executeQuery(
    query: string,
    namedParameters?: Record<string, DBSQLParameter>,
  ): Promise<any[]> {
    try {
      // Get or create session
      const session = await this.getSession();

      const executeStatementOptions = {
        runAsync: false,
        ...(namedParameters ? { namedParameters } : {}),
      };

      try {
        const queryOperation = await session.executeStatement(
          query,
          executeStatementOptions,
        );

        const result = await queryOperation.fetchAll();
        await queryOperation.close();

        return result;
      } catch (queryError) {
        this.logger.warn(`Query failed, retrying: ${queryError.message}`);

        // Invalidate current session and get a new one (with lock protection)
        this.session = null;
        const newSession = await this.getSession();

        const queryOperation = await newSession.executeStatement(
          query,
          executeStatementOptions,
        );

        const result = await queryOperation.fetchAll();
        await queryOperation.close();

        return result;
      }
    } catch (error) {
      this.logger.error(`Query failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Closes the connection and session
   */
  async closeConnection(): Promise<void> {
    // Wait for any ongoing session creation to complete before closing
    if (this.sessionCreationPromise) {
      try {
        await this.sessionCreationPromise;
      } catch {
        // Ignore errors from creation promise
      }
    }

    if (this.session) {
      try {
        await this.session.close();
        this.logger.log("Session closed");
      } catch (error) {
        this.logger.error(`Error closing session: ${error.message}`);
      }
      this.session = null;
    }

    if (this.connection) {
      try {
        await this.connection.close();
        this.logger.log("Connection closed");
      } catch (error) {
        this.logger.error(`Error closing connection: ${error.message}`);
      }
      this.connection = null;
    }

    // Clear the creation promise
    this.sessionCreationPromise = null;
  }
}
