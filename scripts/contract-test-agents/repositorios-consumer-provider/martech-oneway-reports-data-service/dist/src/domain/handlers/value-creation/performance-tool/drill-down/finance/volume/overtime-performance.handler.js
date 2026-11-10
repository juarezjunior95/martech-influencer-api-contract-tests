"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.overtimePerformanceHandler = void 0;
const direction_utils_1 = require("../../../../../../../common/utils/direction.utils");
const handler_base_1 = require("../../../../../handler.base");
class OvertimePerformanceHandler extends handler_base_1.BaseHandler {
    async handle(datasets, defaultDataset) {
        return this.processDatasetData(defaultDataset);
    }
    processDatasetData(dataset) {
        return dataset.data.map((item) => {
            const variationDirectionVsLy = (0, direction_utils_1.formatDirection)(Number(item.ac_vs_ly), {
                positiveZero: false,
            });
            const variationDirectionVsBu = (0, direction_utils_1.formatDirection)(Number(item.ac_vs_bu), {
                positiveZero: false,
            });
            return {
                ...item,
                variationDirectionVsLy,
                variationDirectionVsBu,
            };
        });
    }
}
exports.overtimePerformanceHandler = new OvertimePerformanceHandler();
//# sourceMappingURL=overtime-performance.handler.js.map