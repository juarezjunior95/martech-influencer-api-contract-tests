import { PosToolDrilldownFilterRuleItem } from "@domain/config/presets/category/pos-tool-drilldown/pos-tool-drilldown.types";
import { PosToolDrilldownFilterRulesCommand } from "@domain/config/presets/category/pos-tool-drilldown/filter-rules/filter-rules.command";

export class GrowthLeversFilterRulesCommand implements PosToolDrilldownFilterRulesCommand {
  readonly filterKey = "growth_levers";

  execute(): PosToolDrilldownFilterRuleItem {
    return {
      enable_rules: {},
      disable_rules: {
        growth_levers_selected_disable_portfolio: {
          values: ["Growth Levers"],
          condition_type: "eq",
          apply_to: [
            "portfolio",
            "brand",
            "manufacturer",
            "vb_growth_levers",
            "vb_portfolio",
            "vb_brand",
          ],
        },
      },
    };
  }
}
