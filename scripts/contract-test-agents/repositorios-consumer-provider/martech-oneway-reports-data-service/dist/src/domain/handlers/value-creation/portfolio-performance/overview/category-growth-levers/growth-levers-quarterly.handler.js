"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.growthLeversQuarterlyHandler = void 0;
const handler_base_1 = require("../../../../handler.base");
const direction_utils_1 = require("../../../../../../common/utils/direction.utils");
const label_utils_1 = require("../../../../../../common/utils/label.utils");
const period_utils_1 = require("../../../../../../common/utils/period.utils");
class GrowthLeversQuarterlyHandler extends handler_base_1.BaseHandler {
    async handle(_datasets, defaultDataset) {
        if (!defaultDataset || !defaultDataset.data) {
            return [];
        }
        return defaultDataset.data.map((item) => {
            const refreshDateLabel = (0, period_utils_1.formatPeriod)(item.DT_INI, item.DT_END, {
                yearFormat: "short",
                includeYear: true,
                alwaysUseQuarter: true,
            });
            const vsLyLabelSuffix = (0, period_utils_1.areDatesInSameQuarter)(item.DT_END, item.DT_INI)
                ? "MTD"
                : "YTD";
            const labelVsLyValue = (0, label_utils_1.labelVsLy)({
                dtIni: item.DT_INI,
                dtEnd: item.DT_END,
                yearFormat: "short",
                periodFormatParams: {
                    alwaysUseQuarter: true,
                },
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
exports.growthLeversQuarterlyHandler = new GrowthLeversQuarterlyHandler();
//# sourceMappingURL=growth-levers-quarterly.handler.js.map