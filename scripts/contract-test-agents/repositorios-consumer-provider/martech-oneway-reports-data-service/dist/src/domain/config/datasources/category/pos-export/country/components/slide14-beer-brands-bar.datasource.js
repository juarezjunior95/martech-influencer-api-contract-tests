"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POS_EXPORT_SLIDE14_BEER_BRANDS_DATASET_ID = void 0;
const dataset_repository_factory_1 = require("../../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../../entities/kpi.entity");
const slide13_beer_bb_brands_bar_datasource_1 = require("./slide13-beer-bb-brands-bar.datasource");
exports.POS_EXPORT_SLIDE14_BEER_BRANDS_DATASET_ID = "slide14-beer-brands-bar";
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
            id: exports.POS_EXPORT_SLIDE14_BEER_BRANDS_DATASET_ID,
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: slide13_beer_bb_brands_bar_datasource_1.POS_EXPORT_BRANDS_SP_NAME,
                parameters: filters.map((filter) => filter.name),
                staticParams: { category: "Beer" },
            }),
        },
    ],
    filters,
};
exports.default = config;
//# sourceMappingURL=slide14-beer-brands-bar.datasource.js.map