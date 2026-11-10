"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPosToolDrilldownBreakdownDatasource = createPosToolDrilldownBreakdownDatasource;
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
function createPosToolDrilldownBreakdownDatasource({ functionSuffix, filterNames, }) {
    const datasetIdSuffix = functionSuffix.replace(/-/g, "_");
    const filters = filterNames.map((name) => ({ name, required: true }));
    return {
        datasets: [
            {
                id: `owr_category_pos_tool_drill_down_breakdown${datasetIdSuffix}_fn`,
                config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                    functionName: `1_category_pos-tool_drill-down_breakdown${functionSuffix}`,
                    parameters: filterNames,
                }),
            },
        ],
        entityClass: kpi_entity_1.KpiEntity,
        filters,
    };
}
//# sourceMappingURL=breakdown-datasource.factory.js.map