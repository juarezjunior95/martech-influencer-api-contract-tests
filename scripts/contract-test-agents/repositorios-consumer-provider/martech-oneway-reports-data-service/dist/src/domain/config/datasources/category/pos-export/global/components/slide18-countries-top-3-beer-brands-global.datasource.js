"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POS_EXPORT_SLIDE18_COUNTRIES_TOP3_BEER_BRANDS_GLOBAL_DATASET_ID = void 0;
const dataset_repository_factory_1 = require("../../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../../entities/kpi.entity");
const ranking_brands_handler_1 = __importDefault(require("../../../../../../handlers/category/pos-export/ranking-brands.handler"));
const slide17_countries_top_3_beer_bb_brands_global_datasource_1 = require("./slide17-countries-top-3-beer-bb-brands-global.datasource");
exports.POS_EXPORT_SLIDE18_COUNTRIES_TOP3_BEER_BRANDS_GLOBAL_DATASET_ID = "slide18-countries-top-3-beer-brands-global";
const filters = [
    {
        name: "dt_end",
        required: true,
    },
];
const config = {
    version: "1.0.0",
    entityClass: kpi_entity_1.KpiEntity,
    entityClassAfterHandler: true,
    handler: ranking_brands_handler_1.default,
    datasets: [
        {
            id: exports.POS_EXPORT_SLIDE18_COUNTRIES_TOP3_BEER_BRANDS_GLOBAL_DATASET_ID,
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: slide17_countries_top_3_beer_bb_brands_global_datasource_1.POS_EXPORT_RANKING_CATEGORY_SP_NAME,
                parameters: filters.map((filter) => filter.name),
                staticParams: { category: "Beer" },
            }),
        },
    ],
    filters,
};
exports.default = config;
//# sourceMappingURL=slide18-countries-top-3-beer-brands-global.datasource.js.map