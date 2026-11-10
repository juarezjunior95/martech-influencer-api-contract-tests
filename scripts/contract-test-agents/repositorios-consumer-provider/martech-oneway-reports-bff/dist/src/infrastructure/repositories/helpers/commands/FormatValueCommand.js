"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatValueCommand = void 0;
class FormatValueCommand {
    constructor() {
        this.name = "formatValue";
    }
    execute(value, returnType) {
        const num = typeof value === "string" ? Number(value) : value;
        if (num === null ||
            num === undefined ||
            typeof num !== "number" ||
            isNaN(num)) {
            return "-";
        }
        if (returnType === "number") {
            return num;
        }
        return new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        }).format(num);
    }
}
exports.FormatValueCommand = FormatValueCommand;
//# sourceMappingURL=FormatValueCommand.js.map