"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.innovationHubWaterfallDimensionsHandler = void 0;
const PRESET_KEY = "innovation-hub-waterfall-dimensions";
const row = (value, label, opts) => ({
    value,
    label,
    full: "",
    ...(opts?.isDisabled === true ? { isDisabled: true } : {}),
});
class InnovationHubWaterfallDimensionsPresetHandler {
    get name() {
        return this.constructor.name;
    }
    handle(preset) {
        const values = [
            row("inno_stage", "Inno Stage"),
            row("portfolio", "Portfolio", { isDisabled: true }),
            row("market", "Market", { isDisabled: true }),
            row("liquid_type", "Liquid Type", { isDisabled: true }),
            row("inno_pillar", "Inno Pillar", { isDisabled: true }),
        ];
        const firstEnabled = values.find((v) => v.isDisabled !== true);
        const defaultTuple = firstEnabled ? { ...firstEnabled } : {};
        const out = {
            values,
            default: defaultTuple,
            enabled: true,
        };
        return { ...preset, [PRESET_KEY]: out };
    }
}
exports.innovationHubWaterfallDimensionsHandler = new InnovationHubWaterfallDimensionsPresetHandler();
//# sourceMappingURL=innovation-hub-waterfall-dimensions.handler.js.map