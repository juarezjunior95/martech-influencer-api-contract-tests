import { PresetFilterDto } from "@infrastructure/controllers/dto/preset-filter.dto";
import { Filter } from "@domain/entities/common/base-config.entity";

/**
 * Maps the legacy-namespaced preset query DTO to a flat `Filter[]`.
 *
 * Each `?ns[name]=value` query pair becomes a `Filter` with the
 * outer URL key as `namespace`. Callers that still emit the
 * camelCase `?filter[name]=value` shape continue to work because
 * `filter` is just another namespace.
 */
export class PresetFilterDtoMapper {
  static toFilters(dto: PresetFilterDto | undefined): Filter[] {
    if (!dto || typeof dto !== "object") {
      return [];
    }

    const filters: Filter[] = [];

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
          value: value as string | number | boolean,
        });
      }
    }

    return filters;
  }
}
