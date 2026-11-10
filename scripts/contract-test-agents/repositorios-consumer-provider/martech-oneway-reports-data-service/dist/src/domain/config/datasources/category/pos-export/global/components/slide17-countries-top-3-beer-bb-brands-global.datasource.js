"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POS_EXPORT_RANKING_CATEGORY_SP_NAME = exports.POS_EXPORT_SLIDE17_COUNTRIES_TOP3_BEER_BB_BRANDS_GLOBAL_DATASET_ID = void 0;
const dataset_repository_factory_1 = require("../../../../../../factories/dataset-repository.factory");
const kpi_entity_1 = require("../../../../../../entities/kpi.entity");
const ranking_brands_handler_1 = __importDefault(require("../../../../../../handlers/category/pos-export/ranking-brands.handler"));
exports.POS_EXPORT_SLIDE17_COUNTRIES_TOP3_BEER_BB_BRANDS_GLOBAL_DATASET_ID = "slide17-countries-top-3-beer-bb-brands-global";
exports.POS_EXPORT_RANKING_CATEGORY_SP_NAME = "1_category_pos-results-export_ranking-category";
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
            id: exports.POS_EXPORT_SLIDE17_COUNTRIES_TOP3_BEER_BB_BRANDS_GLOBAL_DATASET_ID,
            config: (0, dataset_repository_factory_1.createDeltalakeProcedureFetchDataConfig)({
                functionName: exports.POS_EXPORT_RANKING_CATEGORY_SP_NAME,
                parameters: filters.map((filter) => filter.name),
                staticParams: { category: "Beer + Beyond Beer" },
            }),
        },
    ],
    filters,
};
exports.default = config;
//# sourceMappingURL=slide17-countries-top-3-beer-bb-brands-global.datasource.js.map