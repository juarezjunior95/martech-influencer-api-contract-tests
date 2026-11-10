export interface PerformanceToolWaterfallTuple {
  label: string;
  value: string;
}

export interface PerformanceToolWaterfallScopeBlock {
  values: PerformanceToolWaterfallTuple[];
  default: PerformanceToolWaterfallTuple;
}

export type PerformanceToolWaterfallOptionsByScope = Record<
  string,
  PerformanceToolWaterfallScopeBlock
>;

export interface PerformanceToolWaterfallOptionsPresetValue {
  enabled: boolean;
  default: PerformanceToolWaterfallScopeBlock | Record<string, never>;
  values: PerformanceToolWaterfallOptionsByScope;
}

export interface PerformanceToolWaterfallOptionsPresetConfig {
  kpi: string;
}
