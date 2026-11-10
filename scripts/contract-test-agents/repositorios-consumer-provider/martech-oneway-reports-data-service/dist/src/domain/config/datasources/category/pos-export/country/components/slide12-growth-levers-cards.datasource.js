"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POS_EXPORT_SLIDE12_GROWTH_LEVERS_CARDS_SP_NAME = exports.POS_EXPORT_SLIDE12_GROWTH_LEVERS_CARDS_DATASET_ID = void 0;
const dataset_repository_factory_1 = require("../../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../../entities/kpi.entity");
exports.POS_EXPORT_SLIDE12_GROWTH_LEVERS_CARDS_DATASET_ID = "slide12-growth-levers-cards";
exports.POS_EXPORT_SLIDE12_GROWTH_LEVERS_CARDS_SP_NAME = "1_category_pos-results-export_growth-levers";
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
            id: exports.POS_EXPORT_SLIDE12_GROWTH_LEVERS_CARDS_DATASET_ID,
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: exports.POS_EXPORT_SLIDE12_GROWTH_LEVERS_CARDS_SP_NAME,
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    filters,
};
exports.default = config;
//# sourceMappingURL=slide12-growth-levers-cards.datasource.js.map