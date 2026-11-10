"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToNumberOrUndefinedCommand = void 0;
class ToNumberOrUndefinedCommand {
    constructor() {
        this.name = "toNumberOrUndefined";
    }
    execute(value) {
        if (typeof value === "number") {
            return Number.isFinite(value) ? value : undefined;
        }
        if (typeof value === "string") {
            const normalized = value.trim().replace(",", ".");
            if (!ToNumberOrUndefinedCommand.NUMERIC_REGEX.test(normalized)) {
                return undefined;
            }
            const parsed = Number(normalized);
            return Number.isFinite(parsed) ? parsed : undefined;
        }
        return undefined;
    }
}
exports.ToNumberOrUndefinedCommand = ToNumberOrUndefinedCommand;
ToNumberOrUndefinedCommand.NUMERIC_REGEX = /^[-+]?[0-9]*[.]?[0-9]+$/;
//# sourceMappingURL=ToNumberOrUndefinedCommand.js.map