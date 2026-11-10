"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POS_EXPORT_SLIDE10_MANUFACTURER_SP_NAME = exports.POS_EXPORT_SLIDE10_MANUFACTURER_DATASET_ID = void 0;
const dataset_repository_factory_1 = require("../../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../../entities/kpi.entity");
exports.POS_EXPORT_SLIDE10_MANUFACTURER_DATASET_ID = "slide10-manufacturer-bar";
exports.POS_EXPORT_SLIDE10_MANUFACTURER_SP_NAME = "1_category_pos-results-export_manufacturer";
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
            id: exports.POS_EXPORT_SLIDE10_MANUFACTURER_DATASET_ID,
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: exports.POS_EXPORT_SLIDE10_MANUFACTURER_SP_NAME,
                parameters: filters.map((filter) => filter.name),
            }),
        },
    ],
    filters,
};
exports.default = config;
//# sourceMappingURL=slide10-manufacturer-bar.datasource.js.map