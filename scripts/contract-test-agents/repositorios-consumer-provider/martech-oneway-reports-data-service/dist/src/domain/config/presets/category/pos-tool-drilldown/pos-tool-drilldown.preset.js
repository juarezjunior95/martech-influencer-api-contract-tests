"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pos_tool_drilldown_handler_1 = require("./pos-tool-drilldown.handler");
const countryScopeDefaults = {
    type: "country",
    page: pos_tool_drilldown_handler_1.CATEGORY_POS_TOOL_DRILLDOWN_PAGE,
    hideGlobalForKpi: "pos",
};
const posToolDrilldownPreset = {
    "pos-tool-drilldown": {},
    [pos_tool_drilldown_handler_1.CATEGORY_POS_TOOL_DRILLDOWN_PAGE]: countryScopeDefaults,
};
const config = {
    version: "1.0.0",
    handler: pos_tool_drilldown_handler_1.posToolDrilldownHandler,
    preset: posToolDrilldownPreset,
};
exports.default = config;
//# sourceMappingURL=pos-tool-drilldown.preset.js.map