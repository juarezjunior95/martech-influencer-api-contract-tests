import { DBSQLParameter } from "@databricks/sql";
import { EnvironmentConfigService } from "@common/config/environment-config.service";
export declare class DatabricksClient {
    private readonly environmentConfigService;
    private readonly logger;
    private readonly host;
    private readonly path;
    private readonly catalog;
    private readonly schema;
    private readonly azureTenantId;
    private readonly oauthClientId;
    private readonly oauthClientSecret;
    private session;
    private connection;
    private sessionCreationPromise;
    constructor(environmentConfigService: EnvironmentConfigService);
    private getSession;
    private createNewSession;
    executeQuery(query: string, namedParameters?: Record<string, DBSQLParameter>): Promise<any[]>;
    closeConnection(): Promise<void>;
}
