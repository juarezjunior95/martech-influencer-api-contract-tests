"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const config = {
    datasets: [
        {
            id: "line-chart",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "value-creation/pr-pages/volume/line-chart",
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters: [
        {
            name: "kpi",
            required: true,
        },
        {
            name: "dt_end",
            required: true,
        },
        {
            name: "period_type",
            required: true,
        },
        {
            name: "growth_lever",
            required: true,
        },
        {
            name: "brand",
            required: true,
        },
        {
            name: "sub_brand",
            required: true,
        },
        {
            name: "country",
            required: true,
        },
        {
            name: "zone",
            required: true,
        },
        {
            name: "page_filter",
            required: true,
        },
        {
            name: "waterfall_filter",
            required: true,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=line-chart.datasource.js.map