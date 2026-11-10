import type { InnovationHubWaterfallOptionsByScope, InnovationHubWaterfallScopeBlock } from "@domain/config/presets/innovation-hub-waterfall-options/innovation-hub-waterfall-options.types";
export declare function getInnovationHubWaterfallOptionsByKpi(kpi: string): InnovationHubWaterfallOptionsByScope;
export declare function firstInnovationHubScopeBlock(map: InnovationHubWaterfallOptionsByScope): InnovationHubWaterfallScopeBlock | undefined;
