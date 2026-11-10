import type { CommercialResultsWaterfallOptionsByScope, CommercialResultsWaterfallScopeBlock } from "@domain/config/presets/commercial-results-waterfall-options/commercial-results-waterfall-options.types";
export declare function getCommercialResultsWaterfallOptionsByKpi(kpi: string): CommercialResultsWaterfallOptionsByScope;
export declare function firstScopeBlock(map: CommercialResultsWaterfallOptionsByScope): CommercialResultsWaterfallScopeBlock | undefined;
