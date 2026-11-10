"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performanceToolByOverTimeTrendsHandler = void 0;
const handler_base_1 = require("../../../../../handler.base");
const direction_utils_1 = require("../../../../../../../common/utils/direction.utils");
class PerformanceToolByOverTimeTrendsHandler extends handler_base_1.BaseHandler {
    async handle(_datasets, defaultDataset) {
        if (!defaultDataset || !defaultDataset.data) {
            return [];
        }
        return defaultDataset.data.map((item) => {
            const variationDirectionAc = (0, direction_utils_1.formatDirection)(Number(item.AC));
            const variationDirectionVsLy = (0, direction_utils_1.formatDirection)(Number(item.AC_VS_LY));
            let year = null;
            let quarter = null;
            if (typeof item.PERIOD === "string") {
                const [yearStr, quarterStr] = item.PERIOD.split(" ");
                year = Number(yearStr);
                quarter = quarterStr ?? null;
            }
            return {
                period: item.PERIOD ?? null,
                year,
                quarter,
                country_iso_code_3: item.COUNTRY_ISO_CODE_3 ?? null,
                segment: item.SEGMENT ?? null,
                unit_of_measure: item.UNIT_OF_MEASURE ?? null,
                comp_unit_of_measure: item.COMP_UNIT_OF_MEASURE ?? null,
                ac: item.AC ?? null,
                variation_direction_ac: variationDirectionAc,
                ac_vs_ly: item.AC_VS_LY ?? null,
                variation_direction_ly: variationDirectionVsLy,
            };
        });
    }
}
exports.performanceToolByOverTimeTrendsHandler = new PerformanceToolByOverTimeTrendsHandler();
//# sourceMappingURL=overtime-trends.handler.js.map