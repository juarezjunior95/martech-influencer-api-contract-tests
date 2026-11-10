"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryFilterRulesCommand = void 0;
class CountryFilterRulesCommand {
    constructor() {
        this.filterKey = "country";
    }
    execute() {
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
exports.CountryFilterRulesCommand = CountryFilterRulesCommand;
//# sourceMappingURL=CountryFilterRulesCommand.js.map