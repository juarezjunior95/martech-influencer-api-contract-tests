import { DatasetRepositoryFactory } from "@domain/factories/dataset-repository.factory";
import { BaseConfig, BaseConfigEntity, DataItem, Dataset, DatasetConfig, Filter, FilterConfig } from "./common/base-config.entity";
import { KpiEntity } from "@domain/entities/kpi.entity";
import { IDatasourceHandler } from "@domain/interfaces/datasource-handler.interface";
export { DataItem, Dataset, DatasetConfig, FilterConfig, Filter };
export type DatasourceDataType = KpiEntity[] | DataItem[];
export type EntityClass = typeof KpiEntity;
export interface DatasourceConfig extends BaseConfig {
    handler?: IDatasourceHandler;
    entityClass?: EntityClass;
    entityClassAfterHandler?: boolean;
}
export declare class DatasourceEntity extends BaseConfigEntity<DatasourceConfig, DatasourceDataType> {
    constructor(datasetRepositoryFactory: DatasetRepositoryFactory, datasourceConfig: DatasourceConfig, name: string);
    protected loadDatasets(filters: Filter[]): Promise<Dataset[]>;
    fetch(filters: Filter[]): Promise<DatasourceDataType>;
    private shouldMapEntityBeforeHandler;
    private shouldMapEntityAfterHandler;
}
