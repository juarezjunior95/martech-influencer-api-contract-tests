import { FilterConfig } from "@domain/entities/common/base-config.entity";

export function buildFilterNames(
  commonFilterNames: readonly string[],
  componentFilterNames: readonly string[] = [],
): string[] {
  return [...commonFilterNames, ...componentFilterNames];
}

export function buildRequiredFilters(
  filterNames: readonly string[],
): FilterConfig[] {
  return filterNames.map((name) => ({
    name,
    required: true,
  }));
}
