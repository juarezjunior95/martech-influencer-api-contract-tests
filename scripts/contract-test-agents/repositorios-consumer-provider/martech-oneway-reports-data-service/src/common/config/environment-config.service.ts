import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

/**
 * Environment Configuration Service
 * Provides typed access to environment variables
 */
@Injectable()
export class EnvironmentConfigService {
  constructor(private readonly configService: ConfigService) {}

  get timeout() {
    return this.configService.get<number>("TIMEOUT", 2000);
  }

  get postgres() {
    return {
      host: this.configService.get<string>("POSTGRES_HOST"),
      port: this.configService.get<number>("POSTGRES_PORT"),
      user: this.configService.get<string>("POSTGRES_USER"),
      password: this.configService.get<string>("POSTGRES_PASSWORD"),
      database: this.configService.get<string>("POSTGRES_DATABASE"),
      schema: this.configService.get<string>("POSTGRES_SCHEMA", "public"),
      ssl: this.configService.get<string>("POSTGRES_SSL") === "true",
      timeout: this.timeout,
      poolMin: this.configService.get<number>("POSTGRES_POOL_MIN", 0),
      poolMax: this.configService.get<number>("POSTGRES_POOL_MAX", 20),
    };
  }

  get databricks() {
    const nodeEnv = this.configService.get<string>("NODE_ENV");
    const appName = this.configService.get<string>("APP_NAME");

    return {
      host: this.configService.get<string>("DATABRICKS_SERVER_HOSTNAME"),
      path: this.configService.get<string>("DATABRICKS_HTTP_PATH"),
      catalog: this.configService.get<string>("DATABRICKS_CATALOG"),
      schema: this.configService.get<string>("DATABRICKS_SCHEMA"),
      azureTenantId: this.configService.get<string>(
        "DATABRICKS_AZURE_TENANT_ID",
      ),
      oauthClientId: this.configService.get<string>(
        "DATABRICKS_OAUTH_CLIENT_ID",
      ),
      oauthClientSecret: this.configService.get<string>(
        "DATABRICKS_OAUTH_CLIENT_SECRET",
      ),
      sessionConfig: {
        configuration: {
          query_tags: `environment:${nodeEnv},app:${appName}`,
        },
      },
      sqlPlaceholders: {
        DATABRICKS_SCHEMA: this.configService.get<string>("DATABRICKS_SCHEMA"),
        KPI_TABLE: this.configService.get<string>("DATABRICKS_KPI_TABLE"),
        // kpi-group-scoped: the date-limit table name diverges between
        // UAT and prod and is not driven by an env var. Branching lives
        // here so the kpi-group preset stays a pure SQL+handler module.
        KPI_GROUP_TABLE:
          nodeEnv === "uat" ? "owr_datelimit_gld" : "owr_datelimit_freeze_gld",
      },
    };
  }

  get env() {
    return this.configService.get<string>("NODE_ENV", "production");
  }
}
