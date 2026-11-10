"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerBookExportModule = void 0;
const common_1 = require("@nestjs/common");
const common_module_1 = require("../../common/common.module");
const view_module_1 = require("./view.module");
const power_book_export_controller_1 = require("../controllers/power-book-export.controller");
const process_power_book_export_usecase_1 = require("../../application/usecases/process-power-book-export.usecase");
const process_countries_export_usecase_1 = require("../../application/usecases/process-countries-export.usecase");
let PowerBookExportModule = class PowerBookExportModule {
};
exports.PowerBookExportModule = PowerBookExportModule;
exports.PowerBookExportModule = PowerBookExportModule = __decorate([
    (0, common_1.Module)({
        imports: [common_module_1.CommonModule, view_module_1.ViewModule],
        controllers: [power_book_export_controller_1.PowerBookExportController],
        providers: [process_power_book_export_usecase_1.ProcessPowerBookExportUseCase, process_countries_export_usecase_1.ProcessCountriesExportUseCase],
    })
], PowerBookExportModule);
//# sourceMappingURL=power-book-export.module.js.map