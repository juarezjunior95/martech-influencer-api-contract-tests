"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../../../entities/kpi.entity");
const performance_tool_types_1 = require("../../../../../../presets/performance-tool/performance-tool.types");
const config = {
    version: "1.0.0",
    entityClass: kpi_entity_1.KpiEntity,
    datasets: [
        {
            id: performance_tool_types_1.PERFORMANCE_TOOL_MARKET_SHARE_UPDATE_STATUS_DATASET_ID,
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: performance_tool_types_1.PERFORMANCE_TOOL_MARKET_SHARE_UPDATE_STATUS_SP_NAME,
                parameters: [],
            }),
        },
    ],
};
exports.default = config;
//# sourceMappingURL=update-status.datasource.js.map