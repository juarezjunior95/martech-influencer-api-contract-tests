"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllGenderTuples = getAllGenderTuples;
exports.getAllAgeGroupTuples = getAllAgeGroupTuples;
exports.getAllIncomeGroupTuples = getAllIncomeGroupTuples;
exports.getAllSocialEconomicLevelTuples = getAllSocialEconomicLevelTuples;
exports.tuplesWithoutAll = tuplesWithoutAll;
const row = (value, label) => ({
    value,
    label,
    full: "",
});
function getAllGenderTuples() {
    return [row("All", "All"), row("Male", "Male"), row("Female", "Female")];
}
function getAllAgeGroupTuples() {
    return [
        row("All", "All"),
        row("LDA - 24", "LDA-24"),
        row("25-34", "25-34"),
        row("35-44", "35-44"),
        row("45-54", "45-54"),
        row("55+", "55+"),
    ];
}
function getAllIncomeGroupTuples() {
    return [
        row("All", "All"),
        row("High Income", "High Income"),
        row("Medium Income", "Medium Income"),
        row("Low Income", "Low Income"),
    ];
}
function getAllSocialEconomicLevelTuples() {
    return [
        row("All", "All"),
        row("Low", "Low"),
        row("Medium", "Medium"),
        row("High", "High"),
    ];
}
function tuplesWithoutAll(rows) {
    if (rows.length === 0) {
        return [];
    }
    return rows.slice(1).map((r) => ({ ...r }));
}
//# sourceMappingURL=demographic-options.model.js.map