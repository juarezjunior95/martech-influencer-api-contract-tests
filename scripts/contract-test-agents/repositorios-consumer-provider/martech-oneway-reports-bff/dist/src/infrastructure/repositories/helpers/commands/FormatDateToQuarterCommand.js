"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatDateToQuarterCommand = void 0;
class FormatDateToQuarterCommand {
    constructor() {
        this.name = "formatDateToQuarter";
    }
    execute(dateString) {
        if (typeof dateString !== "string" || !dateString)
            return "-";
        if (!/^\d{4}-\d{2}-\d{2}/.test(dateString))
            return "-";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime()))
                return "-";
            const month = date.getUTCMonth() + 1;
            const year = date.getUTCFullYear();
            const quarter = Math.floor((month - 1) / 3) + 1;
            return `Q${quarter}'${year.toString().slice(-2)}`;
        }
        catch {
            return "-";
        }
    }
}
exports.FormatDateToQuarterCommand = FormatDateToQuarterCommand;
//# sourceMappingURL=FormatDateToQuarterCommand.js.map