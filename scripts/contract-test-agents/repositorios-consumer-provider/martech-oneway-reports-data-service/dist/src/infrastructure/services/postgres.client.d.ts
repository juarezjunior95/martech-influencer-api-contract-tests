import { Pool } from "pg";
export declare class PostgresClient {
    private readonly pool;
    private readonly logger;
    constructor(pool: Pool);
    executeQuery(query: string, parameters?: any[]): Promise<any[]>;
}
