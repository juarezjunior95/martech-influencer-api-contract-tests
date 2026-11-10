import { FetchDataConfig } from "@domain/repositories/data.repository.interface";
import { DatasetRepositoryFactory } from "../../factories/dataset-repository.factory";
export interface DataItem {
    [key: string]: string | number | object | boolean;
}
export type DataType = DataItem[];
export interface DatasetConfig {
    id?: string;
    provider?: string;
    config: FetchDataConfig;
}
export interface Dataset {
    id: string;
    data: DataType;
}
export interface FilterConfig {
    name: string;
    required?: boolean;
}
export interface Filter {
    namespace?: string;
    name: string;
    value: string | number | boolean;
}
export interface BaseConfig {
    version?: string;
    filters?: FilterConfig[];
    datasets?: DatasetConfig[];
}
export declare abstract class BaseConfigEntity<ConfigType extends BaseConfig, ResultType> {
    protected readonly datasetRepositoryFactory: DatasetRepositoryFactory;
    protected readonly name: string;
    readonly config: ConfigType;
    constructor(datasetRepositoryFactory: DatasetRepositoryFactory, config: ConfigType, name: string);
    getName(): string;
    protected validateRequiredFilters(filters: Filter[]): void;
    protected loadDatasets(filters: Filter[]): Promise<Dataset[]>;
    protected getDefaultDataset(datasets: Dataset[]): Dataset | undefined;
    abstract fetch(filters: Filter[]): Promise<ResultType>;
}
