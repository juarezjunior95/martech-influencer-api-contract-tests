"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPerformanceColorCommand = void 0;
const PERFORMANCE_COLORS = {
    positive: "#007800",
    negative: "#A20A0A",
};
const FALLBACK_COLOR = "#5C5C5C";
class GetPerformanceColorCommand {
    constructor() {
        this.name = "getPerformanceColor";
    }
    execute(performance) {
        if (!performance)
            return FALLBACK_COLOR;
        return PERFORMANCE_COLORS[performance] ?? FALLBACK_COLOR;
    }
}
exports.GetPerformanceColorCommand = GetPerformanceColorCommand;
//# sourceMappingURL=GetPerformanceColorCommand.js.map