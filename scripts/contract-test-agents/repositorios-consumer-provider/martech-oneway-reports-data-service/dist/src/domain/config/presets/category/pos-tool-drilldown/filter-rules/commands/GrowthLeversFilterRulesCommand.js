"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrowthLeversFilterRulesCommand = void 0;
class GrowthLeversFilterRulesCommand {
    constructor() {
        this.filterKey = "growth_levers";
    }
    execute() {
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
exports.GrowthLeversFilterRulesCommand = GrowthLeversFilterRulesCommand;
//# sourceMappingURL=GrowthLeversFilterRulesCommand.js.map