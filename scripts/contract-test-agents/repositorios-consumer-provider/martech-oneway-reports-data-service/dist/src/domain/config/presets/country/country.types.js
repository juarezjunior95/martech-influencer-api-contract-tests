"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCountryFilterItem = isCountryFilterItem;
function isCountryFilterItem(value) {
    return (typeof value === "object" &&
        value !== null &&
        value.type === "country");
}
//# sourceMappingURL=country.types.js.map