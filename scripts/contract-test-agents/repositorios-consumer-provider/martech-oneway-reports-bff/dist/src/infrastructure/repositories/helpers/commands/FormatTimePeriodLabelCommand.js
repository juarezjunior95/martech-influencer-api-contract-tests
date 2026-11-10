"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatTimePeriodLabelCommand = void 0;
const parseDate_1 = require("../parseDate");
const FormatDateToMonthCommand_1 = require("./FormatDateToMonthCommand");
const FormatDateToQuarterCommand_1 = require("./FormatDateToQuarterCommand");
const QUARTER_PERIOD_TYPES = new Set(["QTR", "Q1", "Q2", "Q3", "Q4"]);
const HALF_PERIOD_TYPES = new Set(["HALF", "H1", "H2"]);
const MONTHLY_PERIOD_TYPES = new Set(["MTH", "MTD", "L3M"]);
class FormatTimePeriodLabelCommand {
    constructor() {
        this.name = "formatTimePeriodLabel";
        this.formatMonth = new FormatDateToMonthCommand_1.FormatDateToMonthCommand();
        this.formatQuarter = new FormatDateToQuarterCommand_1.FormatDateToQuarterCommand();
    }
    execute(dateString, periodType) {
        const date = (0, parseDate_1.parseDate)(dateString);
        if (!date)
            return "";
        const normalized = String(periodType ?? "MTH")
            .trim()
            .toUpperCase();
        const yearShort = date.getUTCFullYear().toString().slice(-2);
        const month = date.getUTCMonth() + 1;
        if (normalized === "YTD") {
            return `YTD'${yearShort}`;
        }
        if (normalized === "FY") {
            return `FY'${yearShort}`;
        }
        if (normalized === "R12M") {
            return `R12M'${yearShort}`;
        }
        if (normalized === "R3M") {
            return `R3M'${yearShort}`;
        }
        if (QUARTER_PERIOD_TYPES.has(normalized)) {
            return this.unwrapFormatted(this.formatQuarter.execute(dateString));
        }
        if (HALF_PERIOD_TYPES.has(normalized)) {
            return `${month <= 6 ? "H1" : "H2"}'${yearShort}`;
        }
        if (MONTHLY_PERIOD_TYPES.has(normalized) || normalized === "") {
            return this.unwrapFormatted(this.formatMonth.execute(dateString));
        }
        return this.unwrapFormatted(this.formatMonth.execute(dateString));
    }
    unwrapFormatted(value) {
        return value === "-" ? "" : value;
    }
}
exports.FormatTimePeriodLabelCommand = FormatTimePeriodLabelCommand;
//# sourceMappingURL=FormatTimePeriodLabelCommand.js.map