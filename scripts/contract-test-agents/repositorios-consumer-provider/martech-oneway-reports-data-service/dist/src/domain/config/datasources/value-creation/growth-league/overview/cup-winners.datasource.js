"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const config = {
    datasets: [
        {
            id: "cup-winners",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "value-creation/growth-league/overview/cup-winners",
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters: [],
};
exports.default = config;
//# sourceMappingURL=cup-winners.datasource.js.map