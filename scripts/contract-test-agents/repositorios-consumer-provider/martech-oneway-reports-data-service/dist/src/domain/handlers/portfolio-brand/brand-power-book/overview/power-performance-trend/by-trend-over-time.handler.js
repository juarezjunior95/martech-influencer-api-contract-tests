"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.byTrendOverTimeHandler = void 0;
const handler_base_1 = require("../../../../handler.base");
const direction_utils_1 = require("../../../../../../common/utils/direction.utils");
const period_utils_1 = require("../../../../../../common/utils/period.utils");
class ByTrendOverTimeHandler extends handler_base_1.BaseHandler {
    async handle(_datasets, defaultDataset) {
        if (!defaultDataset || !defaultDataset.data) {
            return [];
        }
        return defaultDataset.data.map((item) => {
            const label = (0, period_utils_1.formatPeriod)(item.DT_INI, item.DT_END, {
                includeYear: true,
                yearFormat: "short",
            });
            const variation_direction = (0, direction_utils_1.formatDirection)(Number(item.AC_VS_LY));
            return {
                value: item.AC,
                variation: item.AC_VS_LY,
                variation_direction,
                label,
            };
        });
    }
}
exports.byTrendOverTimeHandler = new ByTrendOverTimeHandler();
//# sourceMappingURL=by-trend-over-time.handler.js.map