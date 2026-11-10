"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.posToolOverviewPeriodsHandler = void 0;
const pos_tool_timeframe_model_1 = require("../category/pos-tool/pos-tool-timeframe.model");
const time_frame_handler_1 = require("../time-frame/time-frame.handler");
class PosToolOverviewPeriodsPresetHandler {
    get name() {
        return this.constructor.name;
    }
    datasets() {
        return time_frame_handler_1.timeFrameHandler.datasets?.() ?? [];
    }
    handle(preset, datasets) {
        const posToolOverviewPeriods = (0, pos_tool_timeframe_model_1.getPosToolOverviewPeriods)(datasets);
        return {
            ...preset,
            "pos-tool-overview-periods": posToolOverviewPeriods,
        };
    }
}
exports.posToolOverviewPeriodsHandler = new PosToolOverviewPeriodsPresetHandler();
//# sourceMappingURL=pos-tool-overview-periods.handler.js.map