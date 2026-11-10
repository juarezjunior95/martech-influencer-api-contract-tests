"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../factories/dataset-repository.factory");
const filters = [
    {
        name: "dt_end",
        required: true,
    },
    {
        name: "viewtype",
        required: true,
    },
    {
        name: "country",
        required: true,
    },
    {
        name: "period",
        required: true,
    },
];
const config = {
    datasets: [
        {
            id: "test-procedure-dataset",
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: "4_innovation_home_overtime-performance",
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    filters,
};
exports.default = config;
//# sourceMappingURL=example-procedure.datasource.js.map