"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const filters = [
    { name: "country", required: true },
    { name: "category", required: true },
    { name: "time_frame", required: true },
    { name: "dt_end", required: true },
    { name: "periods", required: true },
];
const config = {
    datasets: [
        {
            id: "1_category_pos-tool_overview_pos-overtime-performance-comparison",
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: "1_category_pos-tool_overview_pos-overtime-performance-comparison",
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    filters,
};
exports.default = config;
//# sourceMappingURL=overtime-comparison.datasource.js.map