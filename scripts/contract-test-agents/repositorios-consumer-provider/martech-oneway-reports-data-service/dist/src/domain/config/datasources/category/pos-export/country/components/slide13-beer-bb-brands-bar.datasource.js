"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POS_EXPORT_BRANDS_SP_NAME = exports.POS_EXPORT_SLIDE13_BEER_BB_BRANDS_DATASET_ID = void 0;
const dataset_repository_factory_1 = require("../../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../../entities/kpi.entity");
exports.POS_EXPORT_SLIDE13_BEER_BB_BRANDS_DATASET_ID = "slide13-beer-bb-brands-bar";
exports.POS_EXPORT_BRANDS_SP_NAME = "1_category_pos-results-export_brands";
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
            id: exports.POS_EXPORT_SLIDE13_BEER_BB_BRANDS_DATASET_ID,
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: exports.POS_EXPORT_BRANDS_SP_NAME,
                parameters: filters.map((filter) => filter.name),
                staticParams: { category: "Beer + Beyond Beer" },
            }),
        },
    ],
    filters,
};
exports.default = config;
//# sourceMappingURL=slide13-beer-bb-brands-bar.datasource.js.map