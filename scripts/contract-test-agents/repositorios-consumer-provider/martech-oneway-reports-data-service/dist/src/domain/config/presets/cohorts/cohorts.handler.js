"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cohortsHandler = void 0;
const demographic_options_model_1 = require("./demographic-options.model");
const COHORT_GROUPS = ["Gender", "Age", "Income"];
class CohortsPresetHandler {
    get name() {
        return this.constructor.name;
    }
    handle(preset) {
        const values = COHORT_GROUPS.map((groupName) => ({
            group: groupName,
            values: (0, demographic_options_model_1.tuplesWithoutAll)(this.tuplesForGroup(groupName)),
        }));
        const cohortsValue = {
            values,
            default: [],
            enabled: true,
        };
        return { ...preset, cohorts: cohortsValue };
    }
    tuplesForGroup(groupName) {
        switch (groupName) {
            case "Gender":
                return (0, demographic_options_model_1.getAllGenderTuples)().map((t) => ({ ...t }));
            case "Age":
                return (0, demographic_options_model_1.getAllAgeGroupTuples)().map((t) => ({ ...t }));
            case "Income":
                return (0, demographic_options_model_1.getAllIncomeGroupTuples)().map((t) => ({ ...t }));
            default:
                return [];
        }
    }
}
exports.cohortsHandler = new CohortsPresetHandler();
//# sourceMappingURL=cohorts.handler.js.map