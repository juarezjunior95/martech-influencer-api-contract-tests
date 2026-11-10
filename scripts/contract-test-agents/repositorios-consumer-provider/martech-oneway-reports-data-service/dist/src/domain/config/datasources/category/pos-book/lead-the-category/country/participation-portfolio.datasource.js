"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../../entities/kpi.entity");
const config = {
    datasets: [
        {
            id: "participation-portfolio",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "category/pos-book/lead-the-category/country/participation-portfolio",
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters: [
        {
            name: "timeperiod",
            required: true,
        },
        {
            name: "dt_end",
            required: true,
        },
        {
            name: "country",
            required: true,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=participation-portfolio.datasource.js.map