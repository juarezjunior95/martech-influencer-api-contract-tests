"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.byYearPowerAcHandler = void 0;
const handler_base_1 = require("../../../../handler.base");
const direction_utils_1 = require("../../../../../../common/utils/direction.utils");
const period_utils_1 = require("../../../../../../common/utils/period.utils");
class ByYearPowerAcHandler extends handler_base_1.BaseHandler {
    async handle(_datasets, defaultDataset) {
        if (!defaultDataset || !defaultDataset.data) {
            return [];
        }
        return defaultDataset.data.map((item) => {
            const label = (0, period_utils_1.formatPeriod)(item.DT_INI, item.DT_END, {
                useCumulativeQuarter: true,
                includeYear: true,
                yearFormat: "short",
            });
            const variation_direction = (0, direction_utils_1.formatDirection)(Number(item.AC_VS_LY));
            return {
                value: item.AC,
                variation: item.AC_VS_PREVIOUS_YEAR,
                variation_direction,
                label,
            };
        });
    }
}
exports.byYearPowerAcHandler = new ByYearPowerAcHandler();
//# sourceMappingURL=by-year-power-ac.handler.js.map