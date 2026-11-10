import { IDataRepository } from "../../domain/repositories/datasource.repository.interface";
import { DataSource, Filter } from "../../domain/entities/view.entity";
import { DataServiceClient } from "../services/data-service.client";
export declare class DataRepository implements IDataRepository {
    private readonly dataServiceClient;
    private readonly logger;
    constructor(dataServiceClient: DataServiceClient);
    getData(datasource: string, filters?: Filter[]): Promise<DataSource>;
    private convertFiltersToQueryParams;
}
