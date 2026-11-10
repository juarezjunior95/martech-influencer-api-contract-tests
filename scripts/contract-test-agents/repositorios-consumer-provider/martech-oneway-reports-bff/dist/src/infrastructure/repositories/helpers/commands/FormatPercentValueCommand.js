"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatPercentValueCommand = void 0;
class FormatPercentValueCommand {
    constructor() {
        this.name = "formatPercentValue";
    }
    execute(value, suffix = "%") {
        const num = typeof value === "string" ? Number(value) : value;
        if (num === null ||
            num === undefined ||
            typeof num !== "number" ||
            isNaN(num)) {
            return "-";
        }
        return (new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        }).format(num) + suffix);
    }
}
exports.FormatPercentValueCommand = FormatPercentValueCommand;
//# sourceMappingURL=FormatPercentValueCommand.js.map