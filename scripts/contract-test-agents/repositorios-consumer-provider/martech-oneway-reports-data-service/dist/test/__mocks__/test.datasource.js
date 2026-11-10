"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../src/domain/factories/dataset-repository.factory");
const config = {
    datasets: [
        {
            id: "test",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "test",
            }),
        },
    ],
    filters: [
        {
            name: "country",
            required: true,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=test.datasource.js.map