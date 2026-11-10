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
var DataSourceController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSourceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const fetch_datasource_usecase_1 = require("../../application/usecases/fetch-datasource.usecase");
const datasource_filter_dto_1 = require("./dto/datasource-filter.dto");
const datasource_filter_dto_mapper_1 = require("../mappers/datasource-filter-dto.mapper");
const header_context_interceptor_1 = require("../../common/interceptors/header-context.interceptor");
const datasource_list_util_1 = require("../../common/utils/datasource-list.util");
let DataSourceController = DataSourceController_1 = class DataSourceController {
    constructor(fetchDataSourceUseCase) {
        this.fetchDataSourceUseCase = fetchDataSourceUseCase;
        this.logger = new common_1.Logger(DataSourceController_1.name);
    }
    async getDataSource(name, filters) {
        const data = await this.fetchDataSourceUseCase.execute({
            dataSourceName: name,
            filters: datasource_filter_dto_mapper_1.DataSourceFilterDtoMapper.toFilters(filters),
        });
        return {
            name,
            data,
        };
    }
};
exports.DataSourceController = DataSourceController;
__decorate([
    (0, common_1.Get)(":name"),
    (0, swagger_1.ApiOperation)({
        operationId: "GetDataSource",
        summary: "Get datasource data",
        description: "Retrieves data from a specific datasource with optional filters.\n\n" +
            (0, datasource_list_util_1.generateDatasourcesDescription)(),
    }),
    (0, swagger_1.ApiQuery)({
        name: "filter",
        required: false,
        description: "Dynamic filter object with single level keys. Use filter[paramName]=value",
        schema: {
            type: "object",
            example: {
                country: "BRA",
                brand: "Corona",
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Datasource data retrieved successfully",
        schema: {
            type: "object",
            properties: {
                name: { type: "string" },
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        additionalProperties: true,
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "Invalid datasource parameters",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: "Datasource not found",
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: "Internal server error",
    }),
    __param(0, (0, common_1.Param)("name")),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, datasource_filter_dto_1.DataSourceFilterDto]),
    __metadata("design:returntype", Promise)
], DataSourceController.prototype, "getDataSource", null);
exports.DataSourceController = DataSourceController = DataSourceController_1 = __decorate([
    (0, swagger_1.ApiTags)("datasources"),
    (0, common_1.Controller)("datasources"),
    (0, common_1.UseInterceptors)(header_context_interceptor_1.HeaderContextInterceptor),
    __param(0, (0, common_1.Inject)("FetchDataSourceUseCase")),
    __metadata("design:paramtypes", [fetch_datasource_usecase_1.FetchDataSourceUseCase])
], DataSourceController);
//# sourceMappingURL=datasource.controller.js.map