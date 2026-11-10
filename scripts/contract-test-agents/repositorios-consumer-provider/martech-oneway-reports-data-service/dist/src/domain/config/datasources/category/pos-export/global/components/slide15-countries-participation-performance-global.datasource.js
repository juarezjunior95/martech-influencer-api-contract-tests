"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POS_EXPORT_PARTICIPATION_TOP12_SP_NAME = exports.POS_EXPORT_SLIDE15_PARTICIPATION_TOP12_DATASET_ID = void 0;
const dataset_repository_factory_1 = require("../../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../../entities/kpi.entity");
exports.POS_EXPORT_SLIDE15_PARTICIPATION_TOP12_DATASET_ID = "slide15-countries-participation-performance-global";
exports.POS_EXPORT_PARTICIPATION_TOP12_SP_NAME = "1_category_pos-results-export_participation-top-12";
const filters = [
    {
        name: "country",
        required: true,
    },
    {
        name: "dt_end",
        required: true,
    },
];
const config = {
    version: "1.0.0",
    entityClass: kpi_entity_1.KpiEntity,
    datasets: [
        {
            id: exports.POS_EXPORT_SLIDE15_PARTICIPATION_TOP12_DATASET_ID,
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: exports.POS_EXPORT_PARTICIPATION_TOP12_SP_NAME,
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    filters,
};
exports.default = config;
//# sourceMappingURL=slide15-countries-participation-performance-global.datasource.js.map