import { PosToolDrilldownFilterRuleItem } from "@domain/config/presets/category/pos-tool-drilldown/pos-tool-drilldown.types";
import { PosToolDrilldownFilterRulesCommand } from "@domain/config/presets/category/pos-tool-drilldown/filter-rules/filter-rules.command";
export declare class GrowthLeversFilterRulesCommand implements PosToolDrilldownFilterRulesCommand {
    readonly filterKey = "growth_levers";
    execute(): PosToolDrilldownFilterRuleItem;
}
