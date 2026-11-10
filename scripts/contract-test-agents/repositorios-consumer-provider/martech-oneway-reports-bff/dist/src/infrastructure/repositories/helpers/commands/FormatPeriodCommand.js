"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatPeriodCommand = void 0;
const parseDate_1 = require("../parseDate");
class FormatPeriodCommand {
    constructor() {
        this.name = "formatPeriod";
    }
    execute(dateString) {
        const date = (0, parseDate_1.parseDate)(dateString);
        if (!date)
            return undefined;
        const month = date.toLocaleString("en-US", {
            month: "short",
            timeZone: "UTC",
        });
        const year = date.getUTCFullYear().toString().slice(-2);
        return `${month}'${year}`;
    }
}
exports.FormatPeriodCommand = FormatPeriodCommand;
//# sourceMappingURL=FormatPeriodCommand.js.map