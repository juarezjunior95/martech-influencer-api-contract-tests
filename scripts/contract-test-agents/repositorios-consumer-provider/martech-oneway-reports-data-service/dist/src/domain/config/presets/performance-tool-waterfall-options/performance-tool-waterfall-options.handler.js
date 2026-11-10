"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performanceToolWaterfallOptionsHandler = void 0;
const common_1 = require("@nestjs/common");
const performance_tool_waterfall_options_model_1 = require("./performance-tool-waterfall-options.model");
const PRESET_KEY = "performance-tool-waterfall-options";
class PerformanceToolWaterfallOptionsPresetHandler {
    get name() {
        return this.constructor.name;
    }
    handle(preset) {
        const cfg = (preset[PRESET_KEY] ??
            {});
        const kpi = this.normalizeKpi(cfg?.kpi);
        if (kpi.length === 0) {
            throw new common_1.BadRequestException('The parameter "kpi" is mandatory.');
        }
        const values = (0, performance_tool_waterfall_options_model_1.getPerformanceToolWaterfallOptionsByKpi)(kpi);
        const head = (0, performance_tool_waterfall_options_model_1.firstScopeBlock)(values);
        const defaultBlock = head
            ? {
                values: head.values.map((r) => ({ ...r })),
                default: { ...head.default },
            }
            : {};
        const waterfallValue = {
            values,
            default: defaultBlock,
            enabled: true,
        };
        return { ...preset, [PRESET_KEY]: waterfallValue };
    }
    normalizeKpi(raw) {
        if (typeof raw !== "string") {
            return "";
        }
        return raw.trim().toLowerCase();
    }
}
exports.performanceToolWaterfallOptionsHandler = new PerformanceToolWaterfallOptionsPresetHandler();
//# sourceMappingURL=performance-tool-waterfall-options.handler.js.map