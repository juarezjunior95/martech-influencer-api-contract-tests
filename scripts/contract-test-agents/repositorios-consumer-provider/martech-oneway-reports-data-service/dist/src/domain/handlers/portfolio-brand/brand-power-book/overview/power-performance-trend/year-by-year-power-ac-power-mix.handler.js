"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yearByYearPowerAcPowerMixHandler = void 0;
const handler_base_1 = require("../../../../handler.base");
class YearByYearPowerAcPowerMixHandler extends handler_base_1.BaseHandler {
    async handle(_datasets, defaultDataset) {
        if (!defaultDataset || !defaultDataset.data) {
            return [];
        }
        return defaultDataset.data.map((item) => {
            return {
                value: item.AC,
                dt_ini: item.DT_INI,
            };
        });
    }
}
exports.yearByYearPowerAcPowerMixHandler = new YearByYearPowerAcPowerMixHandler();
//# sourceMappingURL=year-by-year-power-ac-power-mix.handler.js.map