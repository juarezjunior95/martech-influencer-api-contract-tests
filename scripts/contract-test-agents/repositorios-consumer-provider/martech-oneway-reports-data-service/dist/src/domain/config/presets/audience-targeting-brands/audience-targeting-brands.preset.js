"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const audience_targeting_brands_handler_1 = require("./audience-targeting-brands.handler");
const audienceTargetingBrandsPreset = {
    "audience-targeting-brands": {},
};
const config = {
    version: "1.0.0",
    handler: audience_targeting_brands_handler_1.audienceTargetingBrandsHandler,
    preset: audienceTargetingBrandsPreset,
};
exports.default = config;
//# sourceMappingURL=audience-targeting-brands.preset.js.map