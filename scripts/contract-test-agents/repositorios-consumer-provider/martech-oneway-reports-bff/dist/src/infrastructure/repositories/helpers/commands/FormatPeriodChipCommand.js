"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatPeriodChipCommand = void 0;
const FormatDateToMonthCommand_1 = require("./FormatDateToMonthCommand");
const FormatDateToQuarterCommand_1 = require("./FormatDateToQuarterCommand");
const FormatPeriodRangeCommand_1 = require("./FormatPeriodRangeCommand");
class FormatPeriodChipCommand {
    constructor() {
        this.name = "formatPeriodChip";
        this.month = new FormatDateToMonthCommand_1.FormatDateToMonthCommand();
        this.quarter = new FormatDateToQuarterCommand_1.FormatDateToQuarterCommand();
        this.range = new FormatPeriodRangeCommand_1.FormatPeriodRangeCommand();
    }
    execute(startDate, endDate, period, isQuarter = false) {
        const normalized = typeof period === "string" ? period.toUpperCase() : "";
        if (!normalized)
            return isQuarter
                ? this.quarter.execute(endDate)
                : this.month.execute(endDate);
        if (isQuarter) {
            return `${this.quarter.execute(endDate)} ${normalized}`;
        }
        if (normalized === "YTD" || normalized === "L3M") {
            return `${this.range.execute(startDate, endDate)} ${normalized}`;
        }
        return `${this.month.execute(endDate)} ${normalized}`;
    }
}
exports.FormatPeriodChipCommand = FormatPeriodChipCommand;
//# sourceMappingURL=FormatPeriodChipCommand.js.map