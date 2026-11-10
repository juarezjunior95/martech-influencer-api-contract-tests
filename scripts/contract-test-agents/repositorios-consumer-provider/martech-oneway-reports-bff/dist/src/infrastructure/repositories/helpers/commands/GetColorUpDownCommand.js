"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetColorUpDownCommand = void 0;
class GetColorUpDownCommand {
    constructor() {
        this.name = "getColorUpDown";
    }
    execute(value, up, down, options = {}) {
        const { rule = "standard", includeZero = false, nonNumericColor } = options;
        const numeric = typeof value === "number"
            ? value
            : typeof value === "string"
                ? Number(value)
                : NaN;
        if (!Number.isFinite(numeric)) {
            return nonNumericColor;
        }
        const isPositive = includeZero ? numeric >= 0 : numeric > 0;
        const normalizedRule = rule === "reverse" ? "reverse" : "standard";
        const positiveToken = normalizedRule === "reverse" ? down : up;
        const negativeToken = normalizedRule === "reverse" ? up : down;
        return isPositive ? positiveToken : negativeToken;
    }
}
exports.GetColorUpDownCommand = GetColorUpDownCommand;
//# sourceMappingURL=GetColorUpDownCommand.js.map