"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeNumberCommand = void 0;
class SafeNumberCommand {
    constructor() {
        this.name = "safeNumber";
    }
    execute(value) {
        const num = typeof value === "number"
            ? value
            : typeof value === "string"
                ? Number(value)
                : NaN;
        return !isNaN(num) ? num : 0;
    }
}
exports.SafeNumberCommand = SafeNumberCommand;
//# sourceMappingURL=SafeNumberCommand.js.map