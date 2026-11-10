"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const config = {
    datasets: [
        {
            id: "bees-dashboard-maturity-index",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "value-creation/growth-league/rankings/bees-dashboard-maturity-index",
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters: [],
};
exports.default = config;
//# sourceMappingURL=bees-dashboard-maturity-index.datasource.js.map