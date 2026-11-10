import { EntityClass, Filter } from "@domain/entities/datasource.entity";
import { DataType } from "@domain/entities/common/base-config.entity";
export interface FetchDataConfig {
    [key: string]: string | number | boolean | string[];
}
export interface IDataRepository {
    fetchData(fetchDataConfig: FetchDataConfig | null, filters: Filter[], entityClass?: EntityClass): Promise<DataType>;
}
