import type {
  PerformanceToolDimensionConfig,
  PerformanceToolOption,
} from "@domain/config/presets/performance-tool/performance-tool.types";

export function buildStaticDimensionConfig<T extends PerformanceToolOption>(
  options?: readonly T[],
): PerformanceToolDimensionConfig<T> | undefined {
  if (!options?.length) {
    return undefined;
  }

  return {
    values: [...options],
    default: options[0]!,
  };
}
