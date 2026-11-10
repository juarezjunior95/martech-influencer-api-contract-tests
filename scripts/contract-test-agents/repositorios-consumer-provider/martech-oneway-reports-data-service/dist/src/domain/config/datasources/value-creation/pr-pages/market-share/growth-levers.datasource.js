"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const config = {
    datasets: [
        {
            id: "growth-levers",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "value-creation/pr-pages/market-share/growth-levers",
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters: [
        {
            name: "dt_end",
            required: true,
        },
        {
            name: "view_level",
            required: true,
        },
        {
            name: "country",
            required: true,
        },
        {
            name: "growth_lever",
            required: true,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=growth-levers.datasource.js.map