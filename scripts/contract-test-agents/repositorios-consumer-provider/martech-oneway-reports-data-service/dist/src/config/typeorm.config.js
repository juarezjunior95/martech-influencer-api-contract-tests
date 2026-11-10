"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const config_1 = require("@nestjs/config");
const environment_config_service_1 = require("../common/config/environment-config.service");
const configService = new config_1.ConfigService();
const environmentConfigService = new environment_config_service_1.EnvironmentConfigService(configService);
const postgresConfig = environmentConfigService.postgres;
const AppDataSource = new typeorm_1.DataSource({
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
exports.default = AppDataSource;
//# sourceMappingURL=typeorm.config.js.map