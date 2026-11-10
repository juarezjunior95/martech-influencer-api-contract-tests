import { DataSource, Filter } from "../entities/view.entity";
export interface IDataRepository {
    getData(datasource: string, filters?: Filter[]): Promise<DataSource>;
}
