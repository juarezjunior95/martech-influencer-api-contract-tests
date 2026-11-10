"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.innovationHubWaterfallOptionsHandler = void 0;
const common_1 = require("@nestjs/common");
const innovation_hub_waterfall_options_model_1 = require("./innovation-hub-waterfall-options.model");
const PRESET_KEY = "innovation-hub-waterfall-options";
class InnovationHubWaterfallOptionsPresetHandler {
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
        const values = (0, innovation_hub_waterfall_options_model_1.getInnovationHubWaterfallOptionsByKpi)(kpi);
        const head = (0, innovation_hub_waterfall_options_model_1.firstInnovationHubScopeBlock)(values);
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
exports.innovationHubWaterfallOptionsHandler = new InnovationHubWaterfallOptionsPresetHandler();
//# sourceMappingURL=innovation-hub-waterfall-options.handler.js.map