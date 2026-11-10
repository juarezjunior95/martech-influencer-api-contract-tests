import type { PerformanceToolFilterRawRow } from "@domain/config/presets/performance-tool/performance-tool.types";
export declare function buildPerformanceToolFilterPayload(rawData: PerformanceToolFilterRawRow[], enabledKpis: readonly string[], kpiRefreshDates: Record<string, string>, userPermissions: Record<string, string[]>): Record<string, unknown>;
