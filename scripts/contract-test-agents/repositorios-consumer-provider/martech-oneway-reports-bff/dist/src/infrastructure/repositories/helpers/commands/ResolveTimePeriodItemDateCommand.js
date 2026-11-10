"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolveTimePeriodItemDateCommand = void 0;
class ResolveTimePeriodItemDateCommand {
    constructor() {
        this.name = "resolveTimePeriodItemDate";
    }
    execute(item) {
        if (!item)
            return "";
        const dtEnd = item.dt_end;
        if (typeof dtEnd === "string" && dtEnd.trim() !== "") {
            return dtEnd;
        }
        const year = item.year;
        const month = item.month;
        if (typeof year === "number" && typeof month === "number") {
            const paddedMonth = month < 10 ? `0${month}` : String(month);
            return `${year}-${paddedMonth}-01`;
        }
        return "";
    }
}
exports.ResolveTimePeriodItemDateCommand = ResolveTimePeriodItemDateCommand;
//# sourceMappingURL=ResolveTimePeriodItemDateCommand.js.map