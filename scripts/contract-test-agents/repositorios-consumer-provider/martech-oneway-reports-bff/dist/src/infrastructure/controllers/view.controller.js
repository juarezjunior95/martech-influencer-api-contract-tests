"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ViewController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pako = __importStar(require("pako"));
const view_filter_dto_1 = require("./dto/view-filter.dto");
const clear_cache_dto_1 = require("./dto/clear-cache.dto");
const view_filter_dto_mapper_1 = require("../mappers/view-filter-dto.mapper");
const clear_cache_usecase_1 = require("../../application/usecases/clear-cache.usecase");
const header_context_interceptor_1 = require("../../common/interceptors/header-context.interceptor");
const view_list_util_1 = require("../../common/utils/view-list.util");
let ViewController = ViewController_1 = class ViewController {
    constructor(processViewUseCase, clearCacheUseCase) {
        this.processViewUseCase = processViewUseCase;
        this.clearCacheUseCase = clearCacheUseCase;
        this.logger = new common_1.Logger(ViewController_1.name);
    }
    async clearCache(clearCacheDto) {
        return await this.clearCacheUseCase.execute(clearCacheDto.tags);
    }
    async getView(view, filters) {
        const filterSets = view_filter_dto_mapper_1.ViewFilterDtoMapper.toFilterSets(filters);
        const result = await this.processViewUseCase.execute(view, filterSets);
        if (result.compressed) {
            const json = JSON.stringify({
                view: result.view,
                components: result.components,
            });
            const gzipped = pako.gzip(json);
            const b64 = Buffer.from(gzipped).toString("base64");
            return { compressed: true, data: b64 };
        }
        return result;
    }
};
exports.ViewController = ViewController;
__decorate([
    (0, common_1.Delete)("cache"),
    (0, swagger_1.ApiOperation)({
        operationId: "ClearViewCache",
        summary: "Clear view cache by tags",
        description: "Invalidates cache entries associated with the provided tags",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Cache cleared successfully",
        schema: {
            type: "object",
            properties: {
                deletedCount: {
                    type: "number",
                    description: "Number of cache keys deleted",
                },
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "Invalid request body or missing tags",
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: "Internal server error",
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [clear_cache_dto_1.ClearCacheDto]),
    __metadata("design:returntype", Promise)
], ViewController.prototype, "clearCache", null);
__decorate([
    (0, common_1.Get)(":view"),
    (0, swagger_1.ApiOperation)({
        operationId: "GetView",
        summary: "Get view data",
        description: `Retrieves data for a specific view with optional filters.\n\n${(0, view_list_util_1.generateViewsDescription)()}`,
    }),
    (0, swagger_1.ApiParam)({
        name: "view",
        description: `Name of the view to retrieve. Use the view name from the folder structure above (e.g., \`portfolio-brand_brand-power-book_overview_power-book-overview\`).`,
        example: "example",
    }),
    (0, swagger_1.ApiQuery)({
        name: "filter",
        required: false,
        description: "Dynamic filter object with nested keys. Use filter[paramName]=value or filter[group][paramName]=value",
        schema: {
            type: "object",
            example: {
                country: "BRA",
                filterGroup: {
                    country: "ARG",
                    brand: "Corona",
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "View components retrieved successfully",
        schema: {
            type: "object",
            properties: {
                view: { type: "string" },
                components: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            data: { type: "object" },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "Invalid view parameters",
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "View not found",
    }),
    (0, swagger_1.ApiUnprocessableEntityResponse)({
        description: "Request was correct, but view is unprocessable",
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: "Internal server error",
    }),
    __param(0, (0, common_1.Param)("view")),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, view_filter_dto_1.ViewFilterDto]),
    __metadata("design:returntype", Promise)
], ViewController.prototype, "getView", null);
exports.ViewController = ViewController = ViewController_1 = __decorate([
    (0, swagger_1.ApiTags)("views"),
    (0, common_1.Controller)("views"),
    (0, common_1.UseInterceptors)(header_context_interceptor_1.HeaderContextInterceptor),
    __param(0, (0, common_1.Inject)("ICachedProcessViewUseCase")),
    __param(1, (0, common_1.Inject)("ClearCacheUseCase")),
    __metadata("design:paramtypes", [Object, clear_cache_usecase_1.ClearCacheUseCase])
], ViewController);
//# sourceMappingURL=view.controller.js.map