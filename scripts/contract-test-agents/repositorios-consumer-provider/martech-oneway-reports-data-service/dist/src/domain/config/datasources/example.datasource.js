"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../factories/dataset-repository.factory");
const config = {
    datasets: [
        {
            id: "example-dataset",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "example",
            }),
        },
    ],
    filters: [
        {
            name: "test",
            required: true,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=example.datasource.js.map