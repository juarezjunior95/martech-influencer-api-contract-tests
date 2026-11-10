import { PresetFilterDto } from "@infrastructure/controllers/dto/preset-filter.dto";
import { PresetFilter } from "@domain/entities/preset.entity";

/**
 * Maps the legacy-namespaced query DTO to a flat list of `PresetFilter`.
 *
 * Input: any top-level object whose values are themselves objects of
 * primitive scalars (Express `extended` query parser produces this
 * shape from `?ns[name]=value` query strings).
 *
 * Output: `PresetFilter[]` with `{ namespace, name, value }`. The
 * namespace is the outer key of the URL bracket notation.
 */
export class PresetFilterDtoMapper {
  static toFilters(dto: PresetFilterDto | undefined): PresetFilter[] {
    if (!dto || typeof dto !== "object") {
      return [];
    }

    const filters: PresetFilter[] = [];

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
