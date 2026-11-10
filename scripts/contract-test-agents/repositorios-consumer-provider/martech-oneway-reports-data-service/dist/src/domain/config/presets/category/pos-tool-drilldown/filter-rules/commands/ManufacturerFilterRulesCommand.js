"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManufacturerFilterRulesCommand = void 0;
class ManufacturerFilterRulesCommand {
    constructor() {
        this.filterKey = "manufacturer";
    }
    execute() {
        return {
            enable_rules: {
                manufacturer_abi_enable_portfolio_gl: {
                    values: ["ABI"],
                    condition_type: "eq",
                    apply_to: [
                        "portfolio",
                        "growth_levers",
                        "vb_portfolio",
                        "vb_growth_levers",
                    ],
                },
            },
            disable_rules: {
                manufacturer_non_abi_disable_portfolio_gl: {
                    values: ["ABI", ""],
                    condition_type: "nin",
                    apply_to: [
                        "portfolio",
                        "growth_levers",
                        "vb_portfolio",
                        "vb_growth_levers",
                    ],
                },
                manufacturer_competitor_disable_vb_manufacturer: {
                    values: ["Heineken", "Molson", "Constellation"],
                    condition_type: "in",
                    apply_to: [
                        "growth_levers",
                        "portfolio",
                        "vb_growth_levers",
                        "vb_portfolio",
                        "vb_manufacturer",
                    ],
                },
            },
        };
    }
}
exports.ManufacturerFilterRulesCommand = ManufacturerFilterRulesCommand;
//# sourceMappingURL=ManufacturerFilterRulesCommand.js.map