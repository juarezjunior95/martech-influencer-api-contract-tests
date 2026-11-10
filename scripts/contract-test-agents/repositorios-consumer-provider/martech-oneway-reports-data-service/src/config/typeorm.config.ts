import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { EnvironmentConfigService } from "@common/config/environment-config.service";

// Create instances for CLI usage (outside NestJS context)
const configService = new ConfigService();
const environmentConfigService = new EnvironmentConfigService(configService);
const postgresConfig = environmentConfigService.postgres;

const AppDataSource = new DataSource({
  type: "postgres",
  host: postgresConfig.host,
  port: postgresConfig.port,
  username: postgresConfig.user,
  password: postgresConfig.password,
  database: postgresConfig.database,
  schema: postgresConfig.schema,
  ssl: postgresConfig.ssl,
  synchronize: false,
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/../**/migrations/*{.ts,.js}"],
  migrationsRun: false,
  logging: true,
});

export default AppDataSource;
