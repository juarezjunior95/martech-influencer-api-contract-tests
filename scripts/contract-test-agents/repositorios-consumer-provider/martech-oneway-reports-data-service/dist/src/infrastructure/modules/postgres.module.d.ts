import { OnApplicationShutdown } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
export declare class PostgresModule implements OnApplicationShutdown {
    private readonly moduleRef;
    constructor(moduleRef: ModuleRef);
    onApplicationShutdown(): any;
}
