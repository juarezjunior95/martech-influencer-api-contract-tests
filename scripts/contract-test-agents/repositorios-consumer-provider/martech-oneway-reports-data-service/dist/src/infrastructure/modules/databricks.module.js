"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabricksModule = void 0;
const common_1 = require("@nestjs/common");
const databricks_client_1 = require("../services/databricks.client");
const common_module_1 = require("../../common/common.module");
let DatabricksModule = class DatabricksModule {
};
exports.DatabricksModule = DatabricksModule;
exports.DatabricksModule = DatabricksModule = __decorate([
    (0, common_1.Module)({
        imports: [common_module_1.CommonModule],
        providers: [
            {
                provide: "DatabricksClient",
                useClass: databricks_client_1.DatabricksClient,
            },
        ],
        exports: ["DatabricksClient"],
    })
], DatabricksModule);
//# sourceMappingURL=databricks.module.js.map