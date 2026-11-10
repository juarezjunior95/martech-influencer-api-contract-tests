"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatCurrentPeriodCommand = void 0;
class FormatCurrentPeriodCommand {
    constructor() {
        this.name = "formatCurrentPeriod";
    }
    execute() {
        const date = new Date();
        const month = date.toLocaleString("en-US", {
            month: "short",
            timeZone: "UTC",
        });
        const year = date.getUTCFullYear().toString().slice(-2);
        return `${month}'${year}`;
    }
}
exports.FormatCurrentPeriodCommand = FormatCurrentPeriodCommand;
//# sourceMappingURL=FormatCurrentPeriodCommand.js.map