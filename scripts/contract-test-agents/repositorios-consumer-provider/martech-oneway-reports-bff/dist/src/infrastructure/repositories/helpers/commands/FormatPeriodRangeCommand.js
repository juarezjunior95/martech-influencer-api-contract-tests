"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatPeriodRangeCommand = void 0;
class FormatPeriodRangeCommand {
    constructor() {
        this.name = "formatPeriodRange";
    }
    execute(startDate, endDate) {
        if (!this.isDateLike(startDate) || !this.isDateLike(endDate)) {
            return "-";
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return "-";
        }
        const endLabel = this.monthLabel(end, true);
        if (start.getUTCFullYear() === end.getUTCFullYear() &&
            start.getUTCMonth() === end.getUTCMonth()) {
            return endLabel;
        }
        return `${this.monthLabel(start, false)}-${endLabel}`;
    }
    isDateLike(value) {
        return typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value);
    }
    monthLabel(date, includeYear) {
        const month = date.toLocaleString("en-US", {
            month: "short",
            timeZone: "UTC",
        });
        if (!includeYear)
            return month;
        return `${month}'${date.getUTCFullYear().toString().slice(-2)}`;
    }
}
exports.FormatPeriodRangeCommand = FormatPeriodRangeCommand;
//# sourceMappingURL=FormatPeriodRangeCommand.js.map