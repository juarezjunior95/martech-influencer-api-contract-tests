"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POS_EXPORT_SLIDE07_BEER_BB_TABLE_GLOBAL_DATASET_ID = void 0;
const dataset_repository_factory_1 = require("../../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../../entities/kpi.entity");
const slide07_beer_bb_table_datasource_1 = require("../../country/components/slide07-beer-bb-table.datasource");
exports.POS_EXPORT_SLIDE07_BEER_BB_TABLE_GLOBAL_DATASET_ID = "slide07-beer-bb-table-global";
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
            id: exports.POS_EXPORT_SLIDE07_BEER_BB_TABLE_GLOBAL_DATASET_ID,
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: slide07_beer_bb_table_datasource_1.POS_EXPORT_SLIDE07_BEER_BB_TABLE_SP_NAME,
                parameters: filters.map((filter) => filter.name),
                staticParams: { viewtype: "category" },
            }),
        },
    ],
    filters,
};
exports.default = config;
//# sourceMappingURL=slide07-beer-bb-table-global.datasource.js.map