"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatYtdPeriodCommand = void 0;
const parseDate_1 = require("../parseDate");
const MONTH_LABEL_PATTERN = /^([A-Za-z]{3})\s*'(\d{2})$/;
class FormatYtdPeriodCommand {
    constructor() {
        this.name = "formatYtdPeriod";
    }
    execute(dateString, dateLocation) {
        if (typeof dateString !== "string" || !dateString) {
            return undefined;
        }
        const monthLabelMatch = MONTH_LABEL_PATTERN.exec(dateString);
        if (monthLabelMatch) {
            const yr = monthLabelMatch[2];
            return dateLocation === "prefix" ? `YTD'${yr}` : `${yr}'YTD`;
        }
        const date = (0, parseDate_1.parseDate)(dateString);
        if (!date)
            return undefined;
        const year = date.getUTCFullYear().toString().slice(-2);
        return dateLocation === "prefix" ? `YTD'${year}` : `${year}'YTD`;
    }
}
exports.FormatYtdPeriodCommand = FormatYtdPeriodCommand;
//# sourceMappingURL=FormatYtdPeriodCommand.js.map