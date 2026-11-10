"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.growthLeversMonthlyHandler = void 0;
const handler_base_1 = require("../../../../handler.base");
const direction_utils_1 = require("../../../../../../common/utils/direction.utils");
const label_utils_1 = require("../../../../../../common/utils/label.utils");
const month_utils_1 = require("../../../../../../common/utils/month.utils");
class GrowthLeversMonthlyHandler extends handler_base_1.BaseHandler {
    async handle(_datasets, defaultDataset) {
        if (!defaultDataset || !defaultDataset.data) {
            return [];
        }
        return defaultDataset.data.map((item) => {
            const refreshDateLabel = (0, month_utils_1.formatMonth)(item.DT_END, {
                includeYear: true,
                yearFormat: "short",
            });
            const vsLyLabelSuffix = item.DT_END.toLocaleString() === item.DT_INI.toLocaleString()
                ? "MTD"
                : "YTD";
            const labelVsLyValue = (0, label_utils_1.labelVsLyMonth)({
                dtEnd: item.DT_END,
                dtIni: item.DT_INI,
                yearFormat: "short",
            });
            const variationDirectionVsLy = (0, direction_utils_1.formatDirection)(Number(item.VALUE));
            return {
                comp_direction: variationDirectionVsLy,
                date_refresh: refreshDateLabel,
                vs_ly_label: labelVsLyValue,
                vs_ly_label_suffix: vsLyLabelSuffix,
                dt_ini: item.DT_INI,
                dt_end: item.DT_END,
                value: item.VALUE,
                ac: item.AC,
                mix: item.MIX,
                kpi_name: item.KPI_NAME,
            };
        });
    }
}
exports.growthLeversMonthlyHandler = new GrowthLeversMonthlyHandler();
//# sourceMappingURL=growth-levers-monthly.handler.js.map