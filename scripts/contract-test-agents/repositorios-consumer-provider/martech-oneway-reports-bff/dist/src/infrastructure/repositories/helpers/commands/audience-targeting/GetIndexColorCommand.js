"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetIndexColorCommand = void 0;
class GetIndexColorCommand {
    constructor() {
        this.name = "getIndexColor";
        this.defaultColor = { color: "neutral", background: "neutral" };
        this.upColor = { color: "up", background: "up" };
        this.downColor = { color: "down", background: "down" };
        this.tableColor = { color: "neutral", background: "neutral" };
    }
    execute(value, isTable = false) {
        const num = typeof value === "string" ? Number(value) : value;
        if (num === null ||
            num === undefined ||
            typeof num !== "number" ||
            isNaN(num)) {
            return this.defaultColor;
        }
        if (num > 105) {
            return this.upColor;
        }
        if (num < 95) {
            return this.downColor;
        }
        return isTable ? this.tableColor : this.defaultColor;
    }
}
exports.GetIndexColorCommand = GetIndexColorCommand;
//# sourceMappingURL=GetIndexColorCommand.js.map