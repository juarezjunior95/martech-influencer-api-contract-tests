"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDate = parseDate;
function parseDate(dateString) {
    if (typeof dateString !== "string" || !dateString) {
        return undefined;
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return undefined;
    }
    return date;
}
//# sourceMappingURL=parseDate.js.map