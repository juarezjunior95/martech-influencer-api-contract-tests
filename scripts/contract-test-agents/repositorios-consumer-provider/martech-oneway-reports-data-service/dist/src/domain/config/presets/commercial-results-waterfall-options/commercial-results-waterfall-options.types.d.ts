export interface CommercialResultsWaterfallTuple {
    label: string;
    value: string;
}
export interface CommercialResultsWaterfallScopeBlock {
    values: CommercialResultsWaterfallTuple[];
    default: CommercialResultsWaterfallTuple;
}
export type CommercialResultsWaterfallOptionsByScope = Record<string, CommercialResultsWaterfallScopeBlock>;
export interface CommercialResultsWaterfallOptionsPresetValue {
    enabled: boolean;
    default: CommercialResultsWaterfallScopeBlock | Record<string, never>;
    values: CommercialResultsWaterfallOptionsByScope;
}
export interface CommercialResultsWaterfallOptionsPresetConfig {
    kpi: string;
}
