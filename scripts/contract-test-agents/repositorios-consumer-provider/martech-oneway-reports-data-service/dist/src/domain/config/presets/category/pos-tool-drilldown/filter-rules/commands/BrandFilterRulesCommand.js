"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandFilterRulesCommand = void 0;
class BrandFilterRulesCommand {
    constructor() {
        this.filterKey = "brand";
    }
    execute() {
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
exports.BrandFilterRulesCommand = BrandFilterRulesCommand;
//# sourceMappingURL=BrandFilterRulesCommand.js.map