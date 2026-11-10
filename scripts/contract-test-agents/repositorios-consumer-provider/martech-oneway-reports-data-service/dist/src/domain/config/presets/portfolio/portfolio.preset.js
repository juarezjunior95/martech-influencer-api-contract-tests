"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const portfolio_handler_1 = require("./portfolio.handler");
const portfolioPreset = {
    portfolio: {},
};
const config = {
    version: "1.0.0",
    handler: portfolio_handler_1.portfolioHandler,
    preset: portfolioPreset,
};
exports.default = config;
//# sourceMappingURL=portfolio.preset.js.map