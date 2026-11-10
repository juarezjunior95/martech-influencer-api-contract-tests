import { PosToolDrilldownFilterRuleItem } from "@domain/config/presets/category/pos-tool-drilldown/pos-tool-drilldown.types";
import { PosToolDrilldownFilterRulesCommand } from "@domain/config/presets/category/pos-tool-drilldown/filter-rules/filter-rules.command";

export class BrandFilterRulesCommand implements PosToolDrilldownFilterRulesCommand {
  readonly filterKey = "brand";

  execute(): PosToolDrilldownFilterRuleItem {
    return {
      enable_rules: {},
      disable_rules: {
        brand_selected_disable_portfolio_gl: {
          values: [],
          condition_type: "neq",
          apply_to: [
            "portfolio",
            "growth_levers",
            "manufacturer",
            "vb_brand",
            "vb_portfolio",
            "vb_growth_levers",
            "vb_manufacturer",
          ],
        },
      },
    };
  }
}
