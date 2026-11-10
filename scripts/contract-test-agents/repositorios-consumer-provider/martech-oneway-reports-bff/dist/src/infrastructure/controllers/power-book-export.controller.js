"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerBookExportController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const power_book_export_dto_1 = require("./dto/power-book-export.dto");
const view_filter_dto_1 = require("./dto/view-filter.dto");
const view_filter_dto_mapper_1 = require("../mappers/view-filter-dto.mapper");
const process_power_book_export_usecase_1 = require("../../application/usecases/process-power-book-export.usecase");
const process_countries_export_usecase_1 = require("../../application/usecases/process-countries-export.usecase");
const countries_export_dto_1 = require("./dto/countries-export.dto");
const header_context_interceptor_1 = require("../../common/interceptors/header-context.interceptor");
let PowerBookExportController = class PowerBookExportController {
    constructor(exportUseCase, countriesExportUseCase) {
        this.exportUseCase = exportUseCase;
        this.countriesExportUseCase = countriesExportUseCase;
    }
    async exportGroup(body, filters) {
        const filterSets = view_filter_dto_mapper_1.ViewFilterDtoMapper.toFilterSets(filters);
        return this.exportUseCase.execute(body.categories, filterSets, body.period);
    }
    async exportCountries(body, filters) {
        const filterSets = view_filter_dto_mapper_1.ViewFilterDtoMapper.toFilterSets(filters);
        return this.countriesExportUseCase.execute(body.countries, filterSets, body.periods || ["QTD"]);
    }
};
exports.PowerBookExportController = PowerBookExportController;
__decorate([
    (0, common_1.Post)("export"),
    (0, swagger_1.ApiOperation)({
        operationId: "ExportPowerBook",
        summary: "Get batch export data for the specified categories",
        description: "Returns all view data for the specified categories and periods.",
    }),
    (0, swagger_1.ApiQuery)({
        name: "filter",
        required: false,
        description: "Common filters applied to all views (e.g., filter[dt_end], filter[viewtype])",
        schema: {
            type: "object",
            example: {
                dt_end: "2025Q1",
                viewtype: "QTD",
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Export data retrieved successfully",
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "Invalid request (empty categories array)",
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: "Internal server error",
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [power_book_export_dto_1.PowerBookExportDto,
        view_filter_dto_1.ViewFilterDto]),
    __metadata("design:returntype", Promise)
], PowerBookExportController.prototype, "exportGroup", null);
__decorate([
    (0, common_1.Post)("export/countries"),
    (0, swagger_1.ApiOperation)({
        operationId: "ExportPowerBookCountries",
        summary: "Get batch export data for a list of countries",
        description: "Returns all country-level view data for the specified countries. " +
            "Each country gets overview, overviewMegabrands, abiBrandBreakdown, " +
            "competitorBrandBreakdown, and summaryPower data. " +
            "Supports multi-period responses.",
    }),
    (0, swagger_1.ApiQuery)({
        name: "filter",
        required: false,
        description: "Common filters applied to all views (e.g., filter[dt_end])",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Countries export data retrieved successfully",
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "Invalid request (empty countries array)",
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: "Internal server error",
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [countries_export_dto_1.CountriesExportDto,
        view_filter_dto_1.ViewFilterDto]),
    __metadata("design:returntype", Promise)
], PowerBookExportController.prototype, "exportCountries", null);
exports.PowerBookExportController = PowerBookExportController = __decorate([
    (0, swagger_1.ApiTags)("power-book"),
    (0, common_1.Controller)("power-book"),
    (0, common_1.UseInterceptors)(header_context_interceptor_1.HeaderContextInterceptor),
    __metadata("design:paramtypes", [process_power_book_export_usecase_1.ProcessPowerBookExportUseCase,
        process_countries_export_usecase_1.ProcessCountriesExportUseCase])
], PowerBookExportController);
//# sourceMappingURL=power-book-export.controller.js.map