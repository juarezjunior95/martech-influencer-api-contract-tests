import type { PerformanceToolDimensionConfig, PerformanceToolOption } from "@domain/config/presets/performance-tool/performance-tool.types";
export declare function buildStaticDimensionConfig<T extends PerformanceToolOption>(options?: readonly T[]): PerformanceToolDimensionConfig<T> | undefined;
