"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryFilterRulesCommand = void 0;
class CategoryFilterRulesCommand {
    constructor() {
        this.filterKey = "category";
    }
    execute() {
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
exports.CategoryFilterRulesCommand = CategoryFilterRulesCommand;
//# sourceMappingURL=CategoryFilterRulesCommand.js.map