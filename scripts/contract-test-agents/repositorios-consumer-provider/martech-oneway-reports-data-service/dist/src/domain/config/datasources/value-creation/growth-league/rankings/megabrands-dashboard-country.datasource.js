"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../entities/kpi.entity");
const config = {
    datasets: [
        {
            id: "megabrands-dashboard-country",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "value-creation/growth-league/rankings/megabrands-dashboard-country",
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters: [
        {
            name: "dt_ini",
            required: true,
        },
        {
            name: "dt_end",
            required: true,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=megabrands-dashboard-country.datasource.js.map