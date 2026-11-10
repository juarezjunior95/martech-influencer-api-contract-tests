"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const config = {
    datasets: [
        {
            id: "portfolio",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "value-creation/pr-pages/volume-beer-adj/portfolio",
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
            name: "page_type",
            required: true,
        },
        {
            name: "country",
            required: true,
        },
        {
            name: "kpi",
            required: true,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=portfolio.datasource.js.map