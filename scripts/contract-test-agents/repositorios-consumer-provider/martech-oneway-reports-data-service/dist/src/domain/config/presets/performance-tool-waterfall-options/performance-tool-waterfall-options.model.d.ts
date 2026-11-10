import type { PerformanceToolWaterfallOptionsByScope, PerformanceToolWaterfallScopeBlock } from "@domain/config/presets/performance-tool-waterfall-options/performance-tool-waterfall-options.types";
export declare function getPerformanceToolWaterfallOptionsByKpi(kpi: string): PerformanceToolWaterfallOptionsByScope;
export declare function firstScopeBlock(map: PerformanceToolWaterfallOptionsByScope): PerformanceToolWaterfallScopeBlock | undefined;
