"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commercial_results_handler_1 = require("./commercial-results.handler");
const commercialResultsPreset = {
    commercial_results_filters: {
        brand: "All",
        kpi: "volume",
    },
};
const config = {
    version: "1.0.0",
    handler: commercial_results_handler_1.commercialResultsHandler,
    preset: commercialResultsPreset,
};
exports.default = config;
//# sourceMappingURL=commercial-results.preset.js.map