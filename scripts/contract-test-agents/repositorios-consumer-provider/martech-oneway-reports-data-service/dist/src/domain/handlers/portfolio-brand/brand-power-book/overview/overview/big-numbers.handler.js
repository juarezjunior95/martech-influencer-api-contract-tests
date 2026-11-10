"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bigNumbersHandler = void 0;
const label_utils_1 = require("../../../../../../common/utils/label.utils");
const direction_utils_1 = require("../../../../../../common/utils/direction.utils");
const handler_base_1 = require("../../../../handler.base");
class BigNumbersHandler extends handler_base_1.BaseHandler {
    async handle(_datasets, defaultDataset) {
        if (!defaultDataset || !defaultDataset.data) {
            return [];
        }
        return defaultDataset.data.map((item) => {
            const labelVsLqValue = (0, label_utils_1.labelVsLq)({
                dtIni: item.DT_INI,
                dtEnd: item.DT_END,
                yearFormat: "short",
            });
            const labelVsLyValue = (0, label_utils_1.labelVsLy)({
                dtIni: item.DT_INI,
                dtEnd: item.DT_END,
                yearFormat: "short",
            });
            const labelRefreshValue = (0, label_utils_1.labelRefresh)({
                dtIni: item.DT_INI,
                dtEnd: item.DT_END,
                yearFormat: "short",
            });
            const variationDirectionVsLy = (0, direction_utils_1.formatDirection)(Number(item.AC_VS_LY));
            const variationDirectionVsLq = (0, direction_utils_1.formatDirection)(Number(item.AC_VS_LQ));
            return {
                value: item.AC,
                variation_vs_ly: item.AC_VS_LY,
                variation_vs_lq: item.AC_VS_LQ,
                variation_direction_vs_ly: variationDirectionVsLy,
                variation_direction_vs_lq: variationDirectionVsLq,
                label_refresh: labelRefreshValue,
                label_vs_lq: labelVsLqValue,
                label_vs_ly: labelVsLyValue,
            };
        });
    }
}
exports.bigNumbersHandler = new BigNumbersHandler();
//# sourceMappingURL=big-numbers.handler.js.map