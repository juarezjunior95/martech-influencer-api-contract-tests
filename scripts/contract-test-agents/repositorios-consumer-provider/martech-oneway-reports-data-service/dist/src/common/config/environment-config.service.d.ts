import { ConfigService } from "@nestjs/config";
export declare class EnvironmentConfigService {
    private readonly configService;
    constructor(configService: ConfigService);
    get timeout(): number;
    get postgres(): {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
        schema: string;
        ssl: boolean;
        timeout: number;
        poolMin: number;
        poolMax: number;
    };
    get databricks(): {
        host: string;
        path: string;
        catalog: string;
        schema: string;
        azureTenantId: string;
        oauthClientId: string;
        oauthClientSecret: string;
        sessionConfig: {
            configuration: {
                query_tags: string;
            };
        };
        sqlPlaceholders: {
            DATABRICKS_SCHEMA: string;
            KPI_TABLE: string;
            KPI_GROUP_TABLE: string;
        };
    };
    get env(): string;
}
