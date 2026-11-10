import { DatasourceConfig } from "@domain/entities/datasource.entity";
export interface IDatasourceConfigRepository {
    getByName(datasourceName: string): Promise<DatasourceConfig>;
}
