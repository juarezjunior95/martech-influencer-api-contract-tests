"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatLyPeriodCommand = void 0;
const parseDate_1 = require("../parseDate");
class FormatLyPeriodCommand {
    constructor() {
        this.name = "formatLyPeriod";
    }
    execute(dateString) {
        const date = (0, parseDate_1.parseDate)(dateString);
        if (!date)
            return undefined;
        date.setUTCFullYear(date.getUTCFullYear() - 1);
        const month = FormatLyPeriodCommand.MONTHS[date.getUTCMonth()];
        const year = date.getUTCFullYear().toString().slice(-2);
        return `${month}'${year}`;
    }
}
exports.FormatLyPeriodCommand = FormatLyPeriodCommand;
FormatLyPeriodCommand.MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
//# sourceMappingURL=FormatLyPeriodCommand.js.map