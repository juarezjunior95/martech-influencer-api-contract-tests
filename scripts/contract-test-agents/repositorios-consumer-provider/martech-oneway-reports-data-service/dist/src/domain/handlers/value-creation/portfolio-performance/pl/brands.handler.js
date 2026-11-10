"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandsHandler = void 0;
const direction_utils_1 = require("../../../../../common/utils/direction.utils");
const portfolio_utils_1 = require("../../../../../common/utils/portfolio.utils");
const handler_base_1 = require("../../../handler.base");
class BrandsHandler extends handler_base_1.BaseHandler {
    async handle(datasets, defaultDataset) {
        return this.processDatasetData(defaultDataset);
    }
    processDatasetData(dataset) {
        return dataset.data.map((item) => {
            const variationParams = {
                invert: (0, portfolio_utils_1.isReverseDirection)(String(item.KPI_NAME)),
            };
            const dir = (field) => (0, direction_utils_1.formatDirection)(Number(item[field]), variationParams);
            return {
                kpi_name: item.KPI_NAME,
                subtitle: (0, portfolio_utils_1.getKpiTitle)(String(item.KPI_NAME)),
                segment: item.SEGMENT,
                brand: item.RAW_BRAND,
                ac: item.AC ?? null,
                ac_direction: dir("AC"),
                ac_vs_ly: item.AC_VS_LY ?? null,
                ac_vs_ly_direction: dir("AC_VS_LY"),
                dt_ini: item.DT_INI ?? null,
                dt_end: item.DT_END ?? null,
            };
        });
    }
}
exports.brandsHandler = new BrandsHandler();
//# sourceMappingURL=brands.handler.js.map