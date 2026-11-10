import { ViewFilterDto } from "@infrastructure/controllers/dto/view-filter.dto";
import { FilterSet, Filter } from "@domain/entities/view.entity";

export class ViewFilterDtoMapper {
  static toFilterSets(filterDto: ViewFilterDto): FilterSet[] {
    if (!filterDto.filter) return [];

    const filterSets: FilterSet[] = [];
    const defaultFilterSet: Filter[] = [];

    Object.entries(filterDto.filter).forEach(([key, value]) => {
      const hasSet = typeof value === "object" && value !== null;

      if (hasSet) {
        // Has set - creates FilterSet with name (e.g., filterGroup)
        filterSets.push({
          name: key,
          filters: Object.entries(value).map(([nestedKey, nestedValue]) => ({
            name: nestedKey,
            value: nestedValue as string | number | boolean,
          })),
        });
        return;
      }

      // No set - adds to default filter set (e.g., country, status)
      defaultFilterSet.push({
        name: key,
        value: value as string | number | boolean,
      });
    });

    // Adds default filters as FilterSet with empty name
    if (defaultFilterSet.length > 0) {
      filterSets.push({
        name: "", // Empty name for default filters
        filters: defaultFilterSet,
      });
    }

    return filterSets;
  }
}
