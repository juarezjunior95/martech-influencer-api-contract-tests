import { DatasourceEntity } from "@domain/entities/datasource.entity";
import { IDatasourceConfigRepository } from "@domain/repositories/datasource-config.repository.interface";
import { DatasetRepositoryFactory } from "@domain/factories/dataset-repository.factory";
export declare class DatasourceFactory {
    private readonly datasourceConfigRepository;
    private readonly datasetRepositoryFactory;
    constructor(datasourceConfigRepository: IDatasourceConfigRepository, datasetRepositoryFactory: DatasetRepositoryFactory);
    create(dataSourceName: string): Promise<DatasourceEntity>;
}
