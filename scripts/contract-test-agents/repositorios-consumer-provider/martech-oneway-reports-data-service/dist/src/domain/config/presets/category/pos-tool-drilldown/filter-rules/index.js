"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosToolDrilldownFilterRulesCommands = void 0;
const BrandFilterRulesCommand_1 = require("./commands/BrandFilterRulesCommand");
const BrandSegmentsFilterRulesCommand_1 = require("./commands/BrandSegmentsFilterRulesCommand");
const CategoryFilterRulesCommand_1 = require("./commands/CategoryFilterRulesCommand");
const CountryFilterRulesCommand_1 = require("./commands/CountryFilterRulesCommand");
const GrowthLeversFilterRulesCommand_1 = require("./commands/GrowthLeversFilterRulesCommand");
const ManufacturerFilterRulesCommand_1 = require("./commands/ManufacturerFilterRulesCommand");
const getPosToolDrilldownFilterRulesCommands = () => [
    new CategoryFilterRulesCommand_1.CategoryFilterRulesCommand(),
    new CountryFilterRulesCommand_1.CountryFilterRulesCommand(),
    new ManufacturerFilterRulesCommand_1.ManufacturerFilterRulesCommand(),
    new BrandFilterRulesCommand_1.BrandFilterRulesCommand(),
    new BrandSegmentsFilterRulesCommand_1.BrandSegmentsFilterRulesCommand(),
    new GrowthLeversFilterRulesCommand_1.GrowthLeversFilterRulesCommand(),
];
exports.getPosToolDrilldownFilterRulesCommands = getPosToolDrilldownFilterRulesCommands;
//# sourceMappingURL=index.js.map