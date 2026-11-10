"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatSignedValueCommand = void 0;
const FormatValueCommand_1 = require("./FormatValueCommand");
class FormatSignedValueCommand {
    constructor() {
        this.name = "formatSignedValue";
        this.formatValueCommand = new FormatValueCommand_1.FormatValueCommand();
    }
    execute(value) {
        const num = typeof value === "string" ? Number(value) : value;
        if (typeof num !== "number" || isNaN(num)) {
            return "-";
        }
        const formattedValue = this.formatValueCommand.execute(Math.abs(num), "string");
        if (num > 0) {
            return `+\u00A0${formattedValue}`;
        }
        if (num < 0) {
            return `-\u00A0${formattedValue}`;
        }
        return String(formattedValue);
    }
}
exports.FormatSignedValueCommand = FormatSignedValueCommand;
//# sourceMappingURL=FormatSignedValueCommand.js.map