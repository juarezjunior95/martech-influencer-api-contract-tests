"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../entities/kpi.entity");
const config = {
    datasets: [
        {
            id: "increase-abi-lovers",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "consumer/home/increase-abi-lovers",
            }),
        },
    ],
    entityClass: kpi_entity_1.KpiEntity,
    filters: [
        {
            name: "country",
            required: true,
        },
        {
            name: "zone",
            required: true,
        },
        {
            name: "viewtype",
            required: true,
        },
        {
            name: "dt_end",
            required: true,
        },
        {
            name: "timeperiod",
            required: true,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=increase-abi-lovers.datasource.js.map