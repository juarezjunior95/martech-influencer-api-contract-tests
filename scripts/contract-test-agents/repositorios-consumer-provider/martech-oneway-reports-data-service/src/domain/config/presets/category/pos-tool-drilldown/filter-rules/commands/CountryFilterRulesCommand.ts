import { PosToolDrilldownFilterRuleItem } from "@domain/config/presets/category/pos-tool-drilldown/pos-tool-drilldown.types";
import { PosToolDrilldownFilterRulesCommand } from "@domain/config/presets/category/pos-tool-drilldown/filter-rules/filter-rules.command";

export class CountryFilterRulesCommand implements PosToolDrilldownFilterRulesCommand {
  readonly filterKey = "country";

  execute(): PosToolDrilldownFilterRuleItem {
    return {
      enable_rules: {
        country_specific_enable_region: {
          values: ["Global"],
          condition_type: "neq",
          apply_to: ["region", "vb_region"],
        },
      },
      disable_rules: {
        country_global_disable_region: {
          values: ["Global"],
          condition_type: "eq",
          apply_to: ["region", "vb_region"],
        },
      },
    };
  }
}
