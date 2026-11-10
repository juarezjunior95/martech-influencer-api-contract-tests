"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strategicInnovationPillarsHandler = void 0;
const direction_utils_1 = require("../../../../../common/utils/direction.utils");
const handler_base_1 = require("../../../handler.base");
class StrategicInnovationPillarsHandler extends handler_base_1.BaseHandler {
    async handle(datasets, defaultDataset) {
        return this.processDatasetData(defaultDataset);
    }
    processDatasetData(dataset) {
        return dataset.data.map((item) => {
            const averageLineValue = item.AVERAGE_LINE !== undefined ? item.AVERAGE_LINE : item.average_line;
            const variationDirectionAverageLine = (0, direction_utils_1.formatDirection)(Number(averageLineValue), {
                positiveZero: true,
            });
            return {
                ...item,
                country: item.COUNTRY_ISO_CODE_3 ?? item.country_iso_code_3,
                dt_ini: item.DT_INI ?? item.dt_ini,
                dt_end: item.DT_END ?? item.dt_end,
                kpi_name: item.KPI_NAME ?? item.kpi_name,
                ac: item.AC ?? item.ac,
                ac_vs_ly: item.AC_VS_LY !== undefined ? item.AC_VS_LY : item.ac_vs_ly,
                level_1: item.LEVEL_1 ?? item.level_1,
                average_line: averageLineValue,
                average_line_direction: variationDirectionAverageLine,
                year: item.YEAR_INI ?? item.year,
                max_year: item.MAX_YEAR ?? item.max_year,
            };
        });
    }
}
exports.strategicInnovationPillarsHandler = new StrategicInnovationPillarsHandler();
//# sourceMappingURL=strategic-innovation-pillars.handler.js.map