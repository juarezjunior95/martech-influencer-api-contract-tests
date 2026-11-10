import { IDatasourceConfigRepository } from "@domain/repositories/datasource-config.repository.interface";
import { DatasourceConfig } from "@domain/entities/datasource.entity";
import { FileLoaderService } from "@common/services/file-loader.service";
export declare class DatasourceConfigRepository implements IDatasourceConfigRepository {
    private readonly fileLoaderService;
    private readonly logger;
    private readonly cache;
    constructor(fileLoaderService: FileLoaderService);
    getByName(datasourceName: string): Promise<DatasourceConfig>;
    private getConfigPath;
}
