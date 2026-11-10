"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTrendCommand = void 0;
class GetTrendCommand {
    constructor() {
        this.name = "getTrend";
    }
    execute(value, direction) {
        const isNeutral = value === null ||
            value === undefined ||
            (typeof value === "number" && (isNaN(value) || value === 0));
        if (isNeutral) {
            return "positive";
        }
        const dir = typeof direction === "string" ? direction.toLowerCase() : "";
        return dir === "up" ? "positive" : "negative";
    }
}
exports.GetTrendCommand = GetTrendCommand;
//# sourceMappingURL=GetTrendCommand.js.map