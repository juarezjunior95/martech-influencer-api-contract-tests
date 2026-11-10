import { PosToolDrilldownFilterRuleItem } from "@domain/config/presets/category/pos-tool-drilldown/pos-tool-drilldown.types";
import { PosToolDrilldownFilterRulesCommand } from "@domain/config/presets/category/pos-tool-drilldown/filter-rules/filter-rules.command";

export class BrandSegmentsFilterRulesCommand implements PosToolDrilldownFilterRulesCommand {
  readonly filterKey = "brand_segments";

  execute(): PosToolDrilldownFilterRuleItem {
    return {
      enable_rules: {},
      disable_rules: {
        portfolio_selected_disable_growth_levers: {
          values: ["Portfolio"],
          condition_type: "eq",
          apply_to: [
            "growth_levers",
            "brand",
            "vb_portfolio",
            "vb_growth_levers",
            "vb_brand",
          ],
        },
      },
    };
  }
}
