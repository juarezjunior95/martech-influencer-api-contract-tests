"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatNumberToOneDecimal = formatNumberToOneDecimal;
function formatNumberToOneDecimal(num) {
    const value = Number(num);
    if (num === null || Number.isNaN(value)) {
        return "-";
    }
    return value.toFixed(1);
}
//# sourceMappingURL=number-formatter.utils.js.map