"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.incomeGroupsFilterHandler = exports.ageGroupsFilterHandler = exports.genderFilterHandler = void 0;
const demographic_options_model_1 = require("./demographic-options.model");
class DemographicsFilterPresetHandler {
    constructor(responseKey, getTuples) {
        this.responseKey = responseKey;
        this.getTuples = getTuples;
    }
    get name() {
        return this.constructor.name;
    }
    handle(preset) {
        const values = this.getTuples().map((t) => ({ ...t }));
        const defaultTuple = values.length === 0 ? {} : { ...values[0] };
        const payload = {
            values,
            default: defaultTuple,
            enabled: true,
        };
        return { ...preset, [this.responseKey]: payload };
    }
}
exports.genderFilterHandler = new DemographicsFilterPresetHandler("genders", demographic_options_model_1.getAllGenderTuples);
exports.ageGroupsFilterHandler = new DemographicsFilterPresetHandler("age-groups", demographic_options_model_1.getAllAgeGroupTuples);
exports.incomeGroupsFilterHandler = new DemographicsFilterPresetHandler("income-groups", demographic_options_model_1.getAllIncomeGroupTuples);
//# sourceMappingURL=demographics-filter.handler.js.map