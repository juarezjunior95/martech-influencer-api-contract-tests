"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bySegmentPerformanceHandler = void 0;
const handler_base_1 = require("../../../../handler.base");
const direction_utils_1 = require("../../../../../../common/utils/direction.utils");
const label_utils_1 = require("../../../../../../common/utils/label.utils");
const period_utils_1 = require("../../../../../../common/utils/period.utils");
class BySegmentPerformanceHandler extends handler_base_1.BaseHandler {
    async handle(_datasets, defaultDataset) {
        if (!defaultDataset || !defaultDataset.data) {
            return [];
        }
        return defaultDataset.data.map((item) => {
            const period = (0, period_utils_1.formatPeriod)(item.DT_INI, item.DT_END, {
                includeYear: true,
                yearFormat: "short",
            });
            const labelFormattedAc = `AC - ${period}`;
            const labelVsLyValue = (0, label_utils_1.labelVsLy)({
                dtIni: item.DT_INI,
                dtEnd: item.DT_END,
                yearFormat: "short",
            });
            const labelLy = `LY - ${labelVsLyValue}`;
            const labelFormattedLy = labelLy.replace("vs ", "");
            const variationDirectionVsLy = (0, direction_utils_1.formatDirection)(Number(item.AC_VS_LY));
            return {
                price_tier: item.PRICE_TIER,
                segment: item.LEVEL_1,
                label_ac: labelFormattedAc,
                ac: item.AC,
                label_ly: labelFormattedLy,
                ac_vs_ly: item.AC_VS_LY,
                variation_direction_ly: variationDirectionVsLy,
                level_1: item.LEVEL_1,
            };
        });
    }
}
exports.bySegmentPerformanceHandler = new BySegmentPerformanceHandler();
//# sourceMappingURL=by-segment-performance.handler.js.map