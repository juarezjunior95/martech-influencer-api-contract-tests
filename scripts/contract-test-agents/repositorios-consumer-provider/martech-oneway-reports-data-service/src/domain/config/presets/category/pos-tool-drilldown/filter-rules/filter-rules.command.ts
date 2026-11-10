import { PosToolDrilldownFilterRuleItem } from "@domain/config/presets/category/pos-tool-drilldown/pos-tool-drilldown.types";

export interface PosToolDrilldownFilterRulesCommand {
  readonly filterKey: string;
  execute(): PosToolDrilldownFilterRuleItem;
}
