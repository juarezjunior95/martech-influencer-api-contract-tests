import { FilterConfig } from "@domain/entities/common/base-config.entity";
export declare function buildFilterNames(commonFilterNames: readonly string[], componentFilterNames?: readonly string[]): string[];
export declare function buildRequiredFilters(filterNames: readonly string[]): FilterConfig[];
