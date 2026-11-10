"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../../entities/kpi.entity");
const config = {
    datasets: [
        {
            id: "bar-chart",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "value-creation/pr-pages/volume-beer-adj/brands-by-segments/bar-chart",
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
            name: "page_filter",
            required: true,
        },
        {
            name: "period_type",
            required: true,
        },
        {
            name: "kpi",
            required: true,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=bar-chart.datasource.js.map