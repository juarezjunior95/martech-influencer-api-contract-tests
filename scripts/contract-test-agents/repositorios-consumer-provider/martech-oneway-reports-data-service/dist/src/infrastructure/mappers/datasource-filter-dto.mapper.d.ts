import { DataSourceFilterDto } from "@infrastructure/controllers/dto/datasource-filter.dto";
import { Filter } from "@domain/entities/datasource.entity";
export declare class DataSourceFilterDtoMapper {
    static toFilters(filterDto: DataSourceFilterDto): Filter[];
}
