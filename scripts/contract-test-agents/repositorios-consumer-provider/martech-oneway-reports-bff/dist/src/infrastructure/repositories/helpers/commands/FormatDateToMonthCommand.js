"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatDateToMonthCommand = void 0;
class FormatDateToMonthCommand {
    constructor() {
        this.name = "formatDateToMonth";
    }
    execute(dateString) {
        if (!dateString)
            return "-";
        if (!/^\d{4}-\d{2}-\d{2}/.test(dateString))
            return "-";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime()))
                return "-";
            const monthShort = date.toLocaleString("en-US", {
                month: "short",
                timeZone: "UTC",
            });
            const yearLastTwo = date.getUTCFullYear().toString().slice(-2);
            return `${monthShort}'${yearLastTwo}`;
        }
        catch {
            return "-";
        }
    }
}
exports.FormatDateToMonthCommand = FormatDateToMonthCommand;
//# sourceMappingURL=FormatDateToMonthCommand.js.map