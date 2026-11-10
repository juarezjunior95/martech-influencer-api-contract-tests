import { EnvironmentConfigService } from "@common/config/environment-config.service";
export declare class FileLoaderService {
    private readonly environmentConfig;
    private readonly logger;
    private readonly cache;
    constructor(environmentConfig: EnvironmentConfigService);
    load<T>(filePath: string): Promise<T>;
    private loadFileByExt;
}
