"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const config = {
    datasets: [
        {
            id: "1_category_home_filters",
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: "1_category_home_filters",
                parameters: [],
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters: [],
};
exports.default = config;
//# sourceMappingURL=drilldown-filters.datasource.js.map