"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandSegmentsFilterRulesCommand = void 0;
class BrandSegmentsFilterRulesCommand {
    constructor() {
        this.filterKey = "brand_segments";
    }
    execute() {
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
exports.BrandSegmentsFilterRulesCommand = BrandSegmentsFilterRulesCommand;
//# sourceMappingURL=BrandSegmentsFilterRulesCommand.js.map