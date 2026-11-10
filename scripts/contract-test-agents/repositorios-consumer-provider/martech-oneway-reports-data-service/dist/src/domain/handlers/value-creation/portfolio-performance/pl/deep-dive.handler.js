"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepDiveHandler = void 0;
const direction_utils_1 = require("../../../../../common/utils/direction.utils");
const portfolio_utils_1 = require("../../../../../common/utils/portfolio.utils");
const handler_base_1 = require("../../../handler.base");
class DeepDiveHandler extends handler_base_1.BaseHandler {
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
                kpi_title: (0, portfolio_utils_1.getKpiTitle)(String(item.KPI_NAME)),
                ac: item.AC ?? null,
                ly: item.LY ?? null,
                bu: item.BU ?? null,
                og_vs_bu: item.OG_VS_BU ?? null,
                og_vs_bu_comp: item.OG_VS_BU_COMP ?? null,
                og_vs_bu_comp_direction: dir("OG_VS_BU_COMP"),
                og_vs_ly: item.OG_VS_LY ?? null,
                og_vs_ly_comp: item.OG_VS_LY_COMP ?? null,
                og_vs_ly_comp_direction: dir("OG_VS_LY_COMP"),
                dt_ini: item.MAX_INI ?? null,
                dt_end: item.MAX_END ?? null,
            };
        });
    }
}
exports.deepDiveHandler = new DeepDiveHandler();
//# sourceMappingURL=deep-dive.handler.js.map