"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performanceHandler = void 0;
const direction_utils_1 = require("../../../../../common/utils/direction.utils");
const handler_base_1 = require("../../../handler.base");
class PerformanceHandler extends handler_base_1.BaseHandler {
    constructor() {
        super(...arguments);
        this.CONTRIBUTION_MEASURE_UNIT = {
            innovation_volume: "%",
            innovation_nr: "%",
            innovation_maco: "%",
        };
    }
    async handle(datasets, _defaultDataset) {
        return datasets.map((dataset) => {
            return {
                id: dataset.id,
                data: this.processDatasetData(dataset),
            };
        });
    }
    processDatasetData(dataset) {
        return dataset.data.map((item) => {
            const variationDirectionContribution = (0, direction_utils_1.formatDirection)(Number(item.CONTRIBUTION), {
                positiveZero: true,
            });
            const variationDirectionTooltip = (0, direction_utils_1.formatDirection)(Number(item.TOOLTIP), {
                positiveZero: true,
            });
            const contributionMeasure = this.CONTRIBUTION_MEASURE_UNIT[item.KPI_NAME] ?? "";
            return {
                kpi_name: item.KPI_NAME,
                dt_ini: item.DT_INI,
                dt_end: item.DT_END,
                country: item.COUNTRY_ISO_CODE_3,
                label: item.LABEL,
                value: item.VALUE,
                tooltip: item.TOOLTIP,
                tooltip_direction: variationDirectionTooltip,
                contribution: item.CONTRIBUTION,
                contribution_direction: variationDirectionContribution,
                contribution_measure: contributionMeasure,
            };
        });
    }
}
exports.performanceHandler = new PerformanceHandler();
//# sourceMappingURL=performance.handler.js.map