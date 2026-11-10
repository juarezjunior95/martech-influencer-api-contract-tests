import { FetchDataSourceUseCase } from "@application/usecases/fetch-datasource.usecase";
import { DataSourceFilterDto } from "./dto/datasource-filter.dto";
export declare class DataSourceController {
    private readonly fetchDataSourceUseCase;
    private readonly logger;
    constructor(fetchDataSourceUseCase: FetchDataSourceUseCase);
    getDataSource(name: string, filters: DataSourceFilterDto): Promise<{
        name: string;
        data: import("../../domain/entities/datasource.entity").DataItem[];
    }>;
}
