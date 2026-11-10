"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataset_repository_factory_1 = require("../../../../../factories/dataset-repository.factory");
const must_win_markets_handler_1 = require("../../../../../handlers/value-creation/pr-pages/volume/must-win-markets.handler");
const config = {
    datasets: [
        {
            id: "must-win-markets",
            config: (0, dataset_repository_factory_1.createDeltalakeFetchDataConfig)({
                query: "value-creation/pr-pages/volume-beer-adj/must-win-markets",
            }),
        },
    ],
    handler: must_win_markets_handler_1.mustWinMarketsHandler,
    filters: [
        {
            name: "dt_end",
            required: true,
        },
        {
            name: "country",
            required: true,
        },
        {
            name: "page_type",
            required: true,
        },
        {
            name: "kpi",
            required: true,
        },
    ],
};
exports.default = config;
//# sourceMappingURL=must-win-markets.datasource.js.map