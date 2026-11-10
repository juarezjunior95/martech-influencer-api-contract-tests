"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.posKpiHandler = void 0;
const POS_KPIS = [
    { value: "participation", label: "Participation" },
    { value: "occasions", label: "Occasions" },
    { value: "servings", label: "Servings" },
];
class PosKpiPresetHandler {
    get name() {
        return this.constructor.name;
    }
    handle(preset) {
        const values = POS_KPIS.map((row) => ({ ...row }));
        const posKpiValue = {
            values,
            default: { ...values[0] },
            enabled: true,
        };
        return { ...preset, "pos-kpi": posKpiValue };
    }
}
exports.posKpiHandler = new PosKpiPresetHandler();
//# sourceMappingURL=pos-kpi.handler.js.map