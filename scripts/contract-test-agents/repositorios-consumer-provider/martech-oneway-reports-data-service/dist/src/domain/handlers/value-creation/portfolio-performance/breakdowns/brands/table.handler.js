"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.breakdownsBrandsTableHandler = void 0;
const direction_utils_1 = require("../../../../../../common/utils/direction.utils");
const handler_base_1 = require("../../../../handler.base");
class BreakdownsBrandsTableHandler extends handler_base_1.BaseHandler {
    async handle(_datasets, defaultDataset) {
        if (!defaultDataset || !defaultDataset.data) {
            return [];
        }
        return defaultDataset.data.map((item) => {
            const variationDirectionAcVsLy = (0, direction_utils_1.formatDirection)(Number(item.AC_VS_LY));
            const variationDirectionOgVsLy = (0, direction_utils_1.formatDirection)(Number(item.OG_VS_LY));
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
                og_vs_ly: item.OG_VS_LY,
                comp_og_vs_ly_direction: variationDirectionOgVsLy,
                ac: item.AC,
                ac_vs_ly: item.AC_VS_LY,
                comp_ac_vs_ly_direction: variationDirectionAcVsLy,
                ly: item.LY,
                index_value: item.INDEX_VALUE,
            };
        });
    }
}
exports.breakdownsBrandsTableHandler = new BreakdownsBrandsTableHandler();
//# sourceMappingURL=table.handler.js.map