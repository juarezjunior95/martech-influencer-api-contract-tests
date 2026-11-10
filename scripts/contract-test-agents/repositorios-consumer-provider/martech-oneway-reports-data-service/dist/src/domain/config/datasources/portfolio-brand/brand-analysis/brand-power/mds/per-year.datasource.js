"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kpi_entity_1 = require("../../../../../../entities/kpi.entity");
const dataset_repository_factory_1 = require("../../../../../../factories/dataset-repository.factory");
const filters = [
    { name: "country", required: true },
    { name: "sub_brand", required: true },
    { name: "sub_brand_comp", required: true },
    { name: "dt_end", required: true },
    { name: "kpi_name", required: true },
];
const config = {
    version: "1.0.0",
    datasets: [
        {
            id: "per-year",
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: "3_portfolio_brand_brand-power-drivers_meaning-difference-salience_ytd",
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters,
};
exports.default = config;
//# sourceMappingURL=per-year.datasource.js.map