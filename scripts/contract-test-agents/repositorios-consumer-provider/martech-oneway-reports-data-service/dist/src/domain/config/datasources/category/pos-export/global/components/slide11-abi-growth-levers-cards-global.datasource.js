"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POS_EXPORT_SLIDE11_GROWTH_LEVERS_GLOBAL_DATASET_ID = void 0;
const dataset_repository_factory_1 = require("../../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../../entities/kpi.entity");
const slide12_growth_levers_cards_datasource_1 = require("../../country/components/slide12-growth-levers-cards.datasource");
exports.POS_EXPORT_SLIDE11_GROWTH_LEVERS_GLOBAL_DATASET_ID = "slide11-abi-growth-levers-cards-global";
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
            id: exports.POS_EXPORT_SLIDE11_GROWTH_LEVERS_GLOBAL_DATASET_ID,
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: slide12_growth_levers_cards_datasource_1.POS_EXPORT_SLIDE12_GROWTH_LEVERS_CARDS_SP_NAME,
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    filters,
};
exports.default = config;
//# sourceMappingURL=slide11-abi-growth-levers-cards-global.datasource.js.map