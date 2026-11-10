import { PresetConfig } from "@domain/entities/preset.entity";
import { performanceToolHandler } from "@domain/config/presets/performance-tool/performance-tool.handler";

/**
 * `performance-tool` preset — Performance Tool KPI filter payload aligned with
 * Drupal `PerformanceTool` + `FilterContext`, loading combinations from
 * Databricks via the {@link PERFORMANCE_TOOL_FILTER_SP_NAME} statement
 * (`owr_result_query_sp`).
 *
 * Endpoint: `GET /v1/presets/performance-tool`.
 */
const performanceToolPreset = {} as const;

const config: PresetConfig<Record<string, never>> = {
  version: "1.0.0",
  handler: performanceToolHandler,
  preset: performanceToolPreset,
};

export default config;
