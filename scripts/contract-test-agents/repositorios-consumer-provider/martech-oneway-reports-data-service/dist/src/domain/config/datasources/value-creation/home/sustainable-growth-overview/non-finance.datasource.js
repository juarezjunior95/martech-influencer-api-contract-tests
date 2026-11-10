"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const config = {
    datasets: [
        {
            id: "sustainable-growth-overview",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "value-creation/home/sustainable-growth-overview/non-finance",
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters: [
        {
            name: "country",
        },
        {
            name: "kpi_name",
        },
        {
            name: "dt_end",
        },
        {
            name: "viewtype",
        },
        {
            name: "period",
        },
        {
            name: "growth_lever",
        },
    ],
};
exports.default = config;
//# sourceMappingURL=non-finance.datasource.js.map