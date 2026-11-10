"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresetFilterDtoMapper = void 0;
class PresetFilterDtoMapper {
    static toFilters(dto) {
        if (!dto || typeof dto !== "object") {
            return [];
        }
        const filters = [];
        for (const [namespace, group] of Object.entries(dto)) {
            if (!group || typeof group !== "object") {
                continue;
            }
            for (const [name, value] of Object.entries(group)) {
                if (value === undefined || value === null) {
                    continue;
                }
                filters.push({
                    namespace,
                    name,
                    value: value,
                });
            }
        }
        return filters;
    }
}
exports.PresetFilterDtoMapper = PresetFilterDtoMapper;
//# sourceMappingURL=preset-filter-dto.mapper.js.map