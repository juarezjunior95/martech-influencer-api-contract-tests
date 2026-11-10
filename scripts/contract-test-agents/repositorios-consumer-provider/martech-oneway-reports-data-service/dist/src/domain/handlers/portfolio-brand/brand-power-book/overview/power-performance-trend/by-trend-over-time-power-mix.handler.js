"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.byTrendOverTimePowerMixHandler = void 0;
const handler_base_1 = require("../../../../handler.base");
class ByTrendOverTimePowerMixHandler extends handler_base_1.BaseHandler {
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
exports.byTrendOverTimePowerMixHandler = new ByTrendOverTimePowerMixHandler();
//# sourceMappingURL=by-trend-over-time-power-mix.handler.js.map