"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const filters = [
    { name: "country", required: true },
    { name: "category", required: true },
    { name: "time_frame", required: true },
    { name: "dt_end", required: true },
];
const config = {
    datasets: [
        {
            id: "pos-performance-tool-overview-overtime-performance",
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: "1_category_pos-tool_overview_big-numbers",
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters,
};
exports.default = config;
//# sourceMappingURL=overtime-performance.datasource.js.map