"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kpisHandler = void 0;
const common_1 = require("@nestjs/common");
const kpis_model_1 = require("./kpis.model");
class KpisPresetHandler {
    get name() {
        return this.constructor.name;
    }
    handle(preset) {
        const kpisConfig = preset.kpis;
        const kpiGroups = this.normalizeKpiGroups(kpisConfig?.kpiGroups);
        if (kpiGroups.length === 0) {
            throw new common_1.BadRequestException('The parameter "kpi_groups" is mandatory.');
        }
        const values = [];
        for (const group of kpiGroups) {
            values.push(...(0, kpis_model_1.getKpisForGroup)(group));
        }
        const defaultTuple = values.length === 0 ? {} : this.pickDefaultKpi(values);
        const kpisValue = {
            values,
            default: defaultTuple,
            enabled: true,
        };
        return { ...preset, kpis: kpisValue };
    }
    pickDefaultKpi(values) {
        const first = values.find((v) => v.isDisabled !== true);
        return first ? { ...first } : {};
    }
    normalizeKpiGroups(raw) {
        if (Array.isArray(raw)) {
            return raw.map((g) => String(g).trim()).filter((g) => g.length > 0);
        }
        if (typeof raw === "string" && raw.trim().length > 0) {
            return [raw.trim()];
        }
        return [];
    }
}
exports.kpisHandler = new KpisPresetHandler();
//# sourceMappingURL=kpis.handler.js.map