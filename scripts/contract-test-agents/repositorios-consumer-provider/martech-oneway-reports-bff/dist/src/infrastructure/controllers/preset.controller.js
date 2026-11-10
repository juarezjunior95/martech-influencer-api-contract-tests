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
var PresetController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresetController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const preset_filter_dto_1 = require("./dto/preset-filter.dto");
const preset_filter_dto_mapper_1 = require("../mappers/preset-filter-dto.mapper");
const header_context_interceptor_1 = require("../../common/interceptors/header-context.interceptor");
const tokens_1 = require("../../application/usecases/tokens");
const preset_not_found_error_1 = require("../../domain/exceptions/preset-not-found.error");
const invalid_preset_config_error_1 = require("../../domain/exceptions/invalid-preset-config.error");
const preset_list_util_1 = require("../../common/utils/preset-list.util");
let PresetController = PresetController_1 = class PresetController {
    constructor(processPresetUseCase) {
        this.processPresetUseCase = processPresetUseCase;
        this.logger = new common_1.Logger(PresetController_1.name);
    }
    async getPreset(preset, filters) {
        try {
            const filterList = preset_filter_dto_mapper_1.PresetFilterDtoMapper.toFilters(filters);
            return await this.processPresetUseCase.execute(preset, filterList);
        }
        catch (error) {
            if (error instanceof preset_not_found_error_1.PresetNotFoundError) {
                throw new common_1.NotFoundException(error.message);
            }
            if (error instanceof invalid_preset_config_error_1.InvalidPresetConfigError) {
                throw new common_1.BadRequestException(error.message);
            }
            throw error;
        }
    }
};
exports.PresetController = PresetController;
__decorate([
    (0, common_1.Get)(":preset"),
    (0, swagger_1.ApiOperation)({
        operationId: "GetPreset",
        summary: "Get preset data",
        description: "Retrieves filter + config metadata for a specific page/context. " +
            "Country options are automatically scoped to the caller's JWT supportedCountries." +
            `\n\n${(0, preset_list_util_1.generatePresetsDescription)()}`,
    }),
    (0, swagger_1.ApiParam)({
        name: "preset",
        description: "Name of the preset. Use the preset name from the folder structure above (e.g. `brands` or `value-creation_growth-league`).",
        example: "brands",
    }),
    (0, swagger_1.ApiQuery)({
        name: "<namespace>",
        required: false,
        description: "Legacy-style namespaced filter overrides. Use " +
            "`<namespace>[<name>]=<value>` (e.g. `years[no_default]=true`, " +
            "`brand[include_global]=false`, `brand[countries]=BRA,ARG`). The " +
            "outer key selects the preset filter the override applies to.",
        schema: {
            type: "object",
            example: {
                years: { no_default: true },
                brand: { include_global: false, countries: "BRA,ARG" },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Preset retrieved successfully",
        schema: {
            type: "object",
            properties: {
                name: { type: "string" },
                data: { type: "object", additionalProperties: true },
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: "Invalid preset parameters" }),
    (0, swagger_1.ApiNotFoundResponse)({ description: "Preset not found" }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: "Internal server error" }),
    __param(0, (0, common_1.Param)("preset")),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, preset_filter_dto_1.PresetFilterDto]),
    __metadata("design:returntype", Promise)
], PresetController.prototype, "getPreset", null);
exports.PresetController = PresetController = PresetController_1 = __decorate([
    (0, swagger_1.ApiTags)("presets"),
    (0, common_1.Controller)("presets"),
    (0, common_1.UseInterceptors)(header_context_interceptor_1.HeaderContextInterceptor),
    __param(0, (0, common_1.Inject)(tokens_1.CACHED_PROCESS_PRESET_USE_CASE)),
    __metadata("design:paramtypes", [Object])
], PresetController);
//# sourceMappingURL=preset.controller.js.map