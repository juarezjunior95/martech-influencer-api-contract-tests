"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commercialResultsWaterfallOptionsHandler = void 0;
const common_1 = require("@nestjs/common");
const commercial_results_waterfall_options_model_1 = require("./commercial-results-waterfall-options.model");
const PRESET_KEY = "commercial-results-waterfall-options";
class CommercialResultsWaterfallOptionsPresetHandler {
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
        const values = (0, commercial_results_waterfall_options_model_1.getCommercialResultsWaterfallOptionsByKpi)(kpi);
        const head = (0, commercial_results_waterfall_options_model_1.firstScopeBlock)(values);
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
exports.commercialResultsWaterfallOptionsHandler = new CommercialResultsWaterfallOptionsPresetHandler();
//# sourceMappingURL=commercial-results-waterfall-options.handler.js.map