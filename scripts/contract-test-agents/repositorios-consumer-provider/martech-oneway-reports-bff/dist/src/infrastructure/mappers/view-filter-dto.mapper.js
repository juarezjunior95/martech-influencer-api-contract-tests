"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewFilterDtoMapper = void 0;
class ViewFilterDtoMapper {
    static toFilterSets(filterDto) {
        if (!filterDto.filter)
            return [];
        const filterSets = [];
        const defaultFilterSet = [];
        Object.entries(filterDto.filter).forEach(([key, value]) => {
            const hasSet = typeof value === "object" && value !== null;
            if (hasSet) {
                filterSets.push({
                    name: key,
                    filters: Object.entries(value).map(([nestedKey, nestedValue]) => ({
                        name: nestedKey,
                        value: nestedValue,
                    })),
                });
                return;
            }
            defaultFilterSet.push({
                name: key,
                value: value,
            });
        });
        if (defaultFilterSet.length > 0) {
            filterSets.push({
                name: "",
                filters: defaultFilterSet,
            });
        }
        return filterSets;
    }
}
exports.ViewFilterDtoMapper = ViewFilterDtoMapper;
//# sourceMappingURL=view-filter-dto.mapper.js.map