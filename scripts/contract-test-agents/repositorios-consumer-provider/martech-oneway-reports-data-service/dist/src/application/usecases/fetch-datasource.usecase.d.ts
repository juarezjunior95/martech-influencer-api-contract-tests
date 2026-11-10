import { Filter, DataItem } from "@domain/entities/datasource.entity";
import { DatasourceFactory } from "@domain/factories/datasource.factory";
import { IUseCase } from "@application/interfaces/usecase.interface";
export declare class FetchDataSourceUseCase implements IUseCase<{
    dataSourceName: string;
    filters: Filter[];
}, DataItem[]> {
    private readonly datasourceFactory;
    private readonly logger;
    constructor(datasourceFactory: DatasourceFactory);
    execute({ dataSourceName, filters }: {
        dataSourceName: any;
        filters: any;
    }): Promise<DataItem[]>;
}
