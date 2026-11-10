"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../factories/dataset-repository.factory");
const config = {
    datasets: [
        {
            id: "example-postgres-dataset",
            config: (0, dataset_repository_factory_1.createDatabaseFetchDataConfig)({
                query: "example-postgres",
            }),
        },
    ],
    filters: [
        {
            name: "country",
            required: true,
        },
        {
            name: "dt_end",
            required: true,
        },
        {
            name: "page_filter",
        },
        {
            name: "viewtype",
            required: false,
        },
        {
            name: "zone",
            required: false,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=example-postgres.datasource.js.map