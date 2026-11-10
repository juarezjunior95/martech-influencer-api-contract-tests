"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSourceFilterDtoMapper = void 0;
class DataSourceFilterDtoMapper {
    static toFilters(filterDto) {
        if (!filterDto.filter)
            return [];
        const filters = [];
        Object.entries(filterDto.filter).forEach(([key, value]) => {
            filters.push({
                name: key,
                value: value,
            });
        });
        return filters;
    }
}
exports.DataSourceFilterDtoMapper = DataSourceFilterDtoMapper;
//# sourceMappingURL=datasource-filter-dto.mapper.js.map