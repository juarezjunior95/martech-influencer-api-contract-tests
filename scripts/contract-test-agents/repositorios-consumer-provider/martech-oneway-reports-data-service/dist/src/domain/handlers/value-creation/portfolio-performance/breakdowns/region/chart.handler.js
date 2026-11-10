"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regionChartHandler = void 0;
const month_utils_1 = require("../../../../../../common/utils/month.utils");
const handler_base_1 = require("../../../../handler.base");
class RegionChartHandler extends handler_base_1.BaseHandler {
    async handle(_datasets, defaultDataset) {
        if (!defaultDataset || !defaultDataset.data) {
            return [];
        }
        return defaultDataset.data.map((item) => {
            const refreshMonthLabel = (0, month_utils_1.formatMonth)(item.DT_END, {
                includeYear: true,
                yearFormat: "short",
            });
            const lyMonthLabel = (0, month_utils_1.formatMonth)(item.DT_END, {
                includeYear: true,
                yearFormat: "short",
                usePreviousYear: true,
            });
            return {
                period_type: item.PERIOD_TYPE,
                dt_ini: item.DT_INI,
                dt_end: item.DT_END,
                zone: item.ABI_ZONE,
                country: item.COUNTRY_ISO_CODE_3,
                level_3: item.LEVEL_3,
                version_id: item.VERSION_ID,
                kpi_name: item.KPI_NAME,
                value: item.OG_VS_LY,
                ac: item.AC,
                ly: item.LY,
                order_value: item.ORDER_VALUE,
                current_month_label: refreshMonthLabel,
                ly_month_label: lyMonthLabel,
            };
        });
    }
}
exports.regionChartHandler = new RegionChartHandler();
//# sourceMappingURL=chart.handler.js.map