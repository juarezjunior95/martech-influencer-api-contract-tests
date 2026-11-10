"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const country_handler_1 = require("./country.handler");
const country = {
    type: "country",
};
const countryPreset = { country };
const config = {
    version: "1.0.0",
    handler: country_handler_1.countryHandler,
    preset: countryPreset,
};
exports.default = config;
//# sourceMappingURL=country.preset.js.map