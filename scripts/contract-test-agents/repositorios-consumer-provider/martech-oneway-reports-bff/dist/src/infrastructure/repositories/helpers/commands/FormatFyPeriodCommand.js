"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatFyPeriodCommand = void 0;
const parseDate_1 = require("../parseDate");
const LY_MONTH_LABEL_PATTERN = /^([A-Za-z]{3})\s*'(\d{2})$/;
class FormatFyPeriodCommand {
    constructor() {
        this.name = "formatFyPeriod";
    }
    execute(dateString, dateLocation) {
        if (typeof dateString !== "string" || !dateString) {
            return undefined;
        }
        const lyMatch = LY_MONTH_LABEL_PATTERN.exec(dateString);
        if (lyMatch) {
            const yr = lyMatch[2];
            return dateLocation === "prefix" ? `FY'${yr}` : `${yr}'FY`;
        }
        const date = (0, parseDate_1.parseDate)(dateString);
        if (!date)
            return undefined;
        const year = date.getUTCFullYear().toString().slice(-2);
        return dateLocation === "prefix" ? `FY'${year}` : `${year}'FY`;
    }
}
exports.FormatFyPeriodCommand = FormatFyPeriodCommand;
//# sourceMappingURL=FormatFyPeriodCommand.js.map