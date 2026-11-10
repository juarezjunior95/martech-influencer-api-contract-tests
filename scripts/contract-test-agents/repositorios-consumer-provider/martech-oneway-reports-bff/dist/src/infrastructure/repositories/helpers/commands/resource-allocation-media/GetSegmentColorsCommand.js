"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSegmentColorsCommand = void 0;
class GetSegmentColorsCommand {
    constructor() {
        this.name = "getSegmentColors";
    }
    execute() {
        return { ...GetSegmentColorsCommand.SEGMENT_COLORS };
    }
}
exports.GetSegmentColorsCommand = GetSegmentColorsCommand;
GetSegmentColorsCommand.SEGMENT_COLORS = {
    Megabrands: "#E5B611",
    Expansion: "#C2346A",
    Sustain: "#2F74AA",
    Tail: "#4E579F",
};
//# sourceMappingURL=GetSegmentColorsCommand.js.map