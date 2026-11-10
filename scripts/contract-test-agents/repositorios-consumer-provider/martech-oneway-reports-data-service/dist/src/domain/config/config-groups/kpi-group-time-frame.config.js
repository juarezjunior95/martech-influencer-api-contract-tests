"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kpi_group_time_frame_prod_config_1 = __importDefault(require("./kpi-group-time-frame.prod.config"));
const kpi_group_time_frame_uat_config_1 = __importDefault(require("./kpi-group-time-frame.uat.config"));
const kpiGroupTimeFrame = process.env.NODE_ENV === "uat" ? kpi_group_time_frame_uat_config_1.default : kpi_group_time_frame_prod_config_1.default;
exports.default = kpiGroupTimeFrame;
//# sourceMappingURL=kpi-group-time-frame.config.js.map