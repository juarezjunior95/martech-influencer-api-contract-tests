"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bigNumbersHandler = void 0;
const handler_base_1 = require("../../../handler.base");
class BigNumbersHandler extends handler_base_1.BaseHandler {
    constructor() {
        super(...arguments);
        this.MEASURE_KPIS = {
            innovation_volume: {
                measure: "%",
                secondary_measure: null,
            },
            innovation_volume_mix: {
                measure: "pp",
                secondary_measure: "%",
            },
            innovation_nr: {
                measure: "%",
                secondary_measure: null,
            },
            innovation_maco: {
                measure: "%",
                secondary_measure: null,
            },
        };
    }
    async handle(datasets, defaultDataset) {
        return this.processDatasetData(defaultDataset);
    }
    processDatasetData(dataset) {
        return dataset.data.map((item) => {
            const kpi_measures = this.MEASURE_KPIS[item.kpi_name] ?? { measure: null, secondary_measure: null };
            return {
                ...item,
                country: item.country_iso_code_3,
                comp_ac_vs_ly_direction: item.variationDirectionVsLy,
                comp_le_vs_ly_direction: item.variationDirectionVsLe,
                measure: kpi_measures.measure,
                secondary_measure: kpi_measures.secondary_measure,
            };
        });
    }
}
exports.bigNumbersHandler = new BigNumbersHandler();
//# sourceMappingURL=big-numbers.handler.js.map