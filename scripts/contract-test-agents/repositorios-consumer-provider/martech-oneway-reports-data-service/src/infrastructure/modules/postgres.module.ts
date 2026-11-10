import { Module, OnApplicationShutdown } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { EnvironmentConfigService } from "@common/config/environment-config.service";
import { PostgresClient } from "../services/postgres.client";
import { Pool } from "pg";
import { CommonModule } from "@common/common.module";

/**
 * Postgres Module
 * Handles Postgres database connections and operations
 */
@Module({
  imports: [CommonModule],
  providers: [
    {
      provide: "POSTGRES_POOL",
      useFactory: async (
        environmentConfigService: EnvironmentConfigService,
      ) => {
        const config = environmentConfigService.postgres;
        return new Pool({
          host: config.host,
          port: config.port,
          user: config.user,
          password: config.password,
          database: config.database,
          ssl: config.ssl,
          min: config.poolMin,
          max: config.poolMax,
          idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
          allowExitOnIdle: false, // Keep min connections alive
          connectionTimeoutMillis: config.timeout,
          options: `-c search_path=${config.schema}`,
        });
      },
      inject: [EnvironmentConfigService],
    },
    {
      provide: "PostgresClient",
      useClass: PostgresClient,
    },
  ],
  exports: ["PostgresClient"],
})
export class PostgresModule implements OnApplicationShutdown {
  constructor(private readonly moduleRef: ModuleRef) {}

  onApplicationShutdown(): any {
    const pool = this.moduleRef.get("POSTGRES_POOL") as Pool;
    return pool.end();
  }
}
