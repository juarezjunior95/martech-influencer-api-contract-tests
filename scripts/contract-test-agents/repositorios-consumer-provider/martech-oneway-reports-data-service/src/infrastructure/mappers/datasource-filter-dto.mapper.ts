import { DataSourceFilterDto } from "@infrastructure/controllers/dto/datasource-filter.dto";
import { Filter } from "@domain/entities/datasource.entity";

export class DataSourceFilterDtoMapper {
  static toFilters(filterDto: DataSourceFilterDto): Filter[] {
    if (!filterDto.filter) return [];

    const filters: Filter[] = [];

    Object.entries(filterDto.filter).forEach(([key, value]) => {
      filters.push({
        name: key,
        value: value as string | number | boolean,
      });
    });

    return filters;
  }
}
