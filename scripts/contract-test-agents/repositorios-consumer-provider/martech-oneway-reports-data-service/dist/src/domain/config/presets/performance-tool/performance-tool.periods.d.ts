import type { PerformanceToolPeriodOption, PerformanceToolTimePeriodConfig } from "@domain/config/presets/performance-tool/performance-tool.types";
export declare function parseRefreshDateUtc(refresh: string): Date | null;
export declare function buildTimePeriodConfig(refresh: string | undefined): PerformanceToolTimePeriodConfig | null;
export declare function getMonthlyTimeframes(dateEnd: Date): PerformanceToolPeriodOption[];
export declare function getQuarterlyTimeframes(dateEnd: Date): PerformanceToolPeriodOption[];
export declare function buildPeriodOptionsForKpi(kpi: string, kpiGroup: string | undefined, periodTypes: readonly string[] | undefined, kpiRefreshDates: Record<string, string>): {
    values: PerformanceToolPeriodOption[];
    default: PerformanceToolPeriodOption | null;
};
