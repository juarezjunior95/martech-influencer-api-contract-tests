"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const breakdown_datasource_factory_1 = require("./breakdown-datasource.factory");
const config = (0, breakdown_datasource_factory_1.createPosToolDrilldownBreakdownDatasource)({
    functionSuffix: "-portfolio",
    filterNames: [
        "country",
        "category",
        "timeframe",
        "dt_end",
        "kpi",
        "view_by",
        "manufacturer",
        "brand",
        "brand_segments",
        "region",
        "cohort",
    ],
});
exports.default = config;
//# sourceMappingURL=breakdown-portfolio.datasource.js.map