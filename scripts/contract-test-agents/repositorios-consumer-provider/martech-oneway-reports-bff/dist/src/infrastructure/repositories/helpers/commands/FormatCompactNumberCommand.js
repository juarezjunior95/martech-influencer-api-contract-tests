"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatCompactNumberCommand = void 0;
class FormatCompactNumberCommand {
    constructor() {
        this.name = "formatCompactNumber";
    }
    execute(value) {
        if (typeof value !== "number" || isNaN(value)) {
            return "-";
        }
        const formatter = Intl.NumberFormat("en-US", {
            notation: "compact",
            compactDisplay: "short",
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        });
        return formatter
            .format(value)
            .replace(/[K]/g, (suffix) => suffix.toLowerCase());
    }
}
exports.FormatCompactNumberCommand = FormatCompactNumberCommand;
//# sourceMappingURL=FormatCompactNumberCommand.js.map