import { PosToolDrilldownFilterRuleItem } from "@domain/config/presets/category/pos-tool-drilldown/pos-tool-drilldown.types";
import { PosToolDrilldownFilterRulesCommand } from "@domain/config/presets/category/pos-tool-drilldown/filter-rules/filter-rules.command";

export class CategoryFilterRulesCommand implements PosToolDrilldownFilterRulesCommand {
  readonly filterKey = "category";

  execute(): PosToolDrilldownFilterRuleItem {
    return {
      enable_rules: {
        category_alcohol_enable: {
          values: ["Alcohol"],
          condition_type: "eq",
          apply_to: ["brand", "cohort", "vb_category"],
        },
      },
      disable_rules: {
        category_alcohol_disable: {
          values: ["Alcohol"],
          condition_type: "eq",
          apply_to: [
            "manufacturer",
            "portfolio",
            "growth_levers",
            "vb_manufacturer",
            "vb_portfolio",
            "vb_growth_levers",
          ],
        },
      },
    };
  }
}
