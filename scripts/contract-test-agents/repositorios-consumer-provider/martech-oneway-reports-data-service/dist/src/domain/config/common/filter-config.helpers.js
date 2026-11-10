"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFilterNames = buildFilterNames;
exports.buildRequiredFilters = buildRequiredFilters;
function buildFilterNames(commonFilterNames, componentFilterNames = []) {
    return [...commonFilterNames, ...componentFilterNames];
}
function buildRequiredFilters(filterNames) {
    return filterNames.map((name) => ({
        name,
        required: true,
    }));
}
//# sourceMappingURL=filter-config.helpers.js.map