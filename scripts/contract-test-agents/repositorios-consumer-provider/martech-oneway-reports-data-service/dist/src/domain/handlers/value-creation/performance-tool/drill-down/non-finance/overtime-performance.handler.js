"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.overtimePerformanceHandler = void 0;
const direction_utils_1 = require("../../../../../../common/utils/direction.utils");
const handler_base_1 = require("../../../../handler.base");
class OvertimePerformanceHandler extends handler_base_1.BaseHandler {
    async handle(_datasets, defaultDataset) {
        if (!defaultDataset || !defaultDataset.data) {
            return [];
        }
        return defaultDataset.data.map((item) => {
            const variationDirectionVsLy = (0, direction_utils_1.formatDirection)(Number(item.AC_VS_LY));
            return {
                period_type: item.PERIOD,
                value: item.AC,
                value_measure: item.UNIT_OF_MEASURE,
                variation_vs_ly: item.AC_VS_LY,
                comp_unit_of_measure: item.COMP_UNIT_OF_MEASURE,
                variation_direction_vs_ly: variationDirectionVsLy,
                dt_ini: item.DT_INI,
                dt_end: item.DT_END,
            };
        });
    }
}
exports.overtimePerformanceHandler = new OvertimePerformanceHandler();
//# sourceMappingURL=overtime-performance.handler.js.map