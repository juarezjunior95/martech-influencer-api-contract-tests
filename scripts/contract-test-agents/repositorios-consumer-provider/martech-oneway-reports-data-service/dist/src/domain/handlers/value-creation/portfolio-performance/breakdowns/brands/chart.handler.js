"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.breakdownsBrandsChartHandler = void 0;
const month_utils_1 = require("../../../../../../common/utils/month.utils");
const handler_base_1 = require("../../../../handler.base");
class BreakdownsBrandsChartHandler extends handler_base_1.BaseHandler {
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
            const segment = item.SEGMENT ?? item.PRICE_TIER;
            return {
                period_type: item.PERIOD_TYPE,
                dt_ini: item.DT_INI,
                dt_end: item.DT_END,
                raw_brand: item.RAW_BRAND,
                brand: item.RAW_BRAND,
                segment: segment,
                price_tier: item.PRICE_TIER,
                level_3: item.LEVEL_3,
                zone: item.ABI_ZONE,
                country: item.COUNTRY_ISO_CODE_3,
                version_id: item.VERSION_ID,
                kpi_name: item.KPI_NAME,
                value: item.OG_VS_LY,
                ac: item.AC,
                ly: item.LY,
                current_month_label: refreshMonthLabel,
                ly_month_label: lyMonthLabel,
            };
        });
    }
}
exports.breakdownsBrandsChartHandler = new BreakdownsBrandsChartHandler();
//# sourceMappingURL=chart.handler.js.map