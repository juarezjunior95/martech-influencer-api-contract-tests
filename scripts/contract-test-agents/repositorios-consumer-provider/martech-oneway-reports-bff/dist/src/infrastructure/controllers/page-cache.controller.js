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
exports.PageCacheController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const set_page_cache_dto_1 = require("./dto/set-page-cache.dto");
const get_page_cache_usecase_1 = require("../../application/usecases/get-page-cache.usecase");
const set_page_cache_usecase_1 = require("../../application/usecases/set-page-cache.usecase");
const header_context_interceptor_1 = require("../../common/interceptors/header-context.interceptor");
let PageCacheController = class PageCacheController {
    constructor(getPageCacheUseCase, setPageCacheUseCase) {
        this.getPageCacheUseCase = getPageCacheUseCase;
        this.setPageCacheUseCase = setPageCacheUseCase;
    }
    async getPageCache(name, hash) {
        const result = await this.getPageCacheUseCase.execute(name, hash);
        if (!result) {
            throw new common_1.NotFoundException(`No cached page found for "${name}" with hash "${hash}"`);
        }
        return result;
    }
    async setPageCache(name, hash, dto) {
        const cached = await this.setPageCacheUseCase.execute(name, hash, dto.html);
        return { cached };
    }
};
exports.PageCacheController = PageCacheController;
__decorate([
    (0, common_1.Get)(":name/:hash"),
    (0, swagger_1.ApiOperation)({
        operationId: "GetPageCache",
        summary: "Get cached page HTML",
        description: "Retrieves cached HTML for a page identified by name and hash",
    }),
    (0, swagger_1.ApiParam)({
        name: "name",
        description: "Page cache name (e.g. value-creation_volume-pages)",
        example: "value-creation_volume-pages",
    }),
    (0, swagger_1.ApiParam)({
        name: "hash",
        description: "Opaque hash representing page state (filters, date range, etc.)",
        example: "abc123def456",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Cached HTML retrieved successfully (fresh or stale)",
        schema: {
            type: "object",
            properties: {
                html: { type: "string" },
                isStale: { type: "boolean" },
                cacheStatus: { type: "string", enum: ["fresh", "stale"] },
                shouldRevalidate: { type: "boolean" },
                ttlRemainingSeconds: { type: "number", nullable: true },
                freshWindowSeconds: { type: "number" },
                staleWindowSeconds: { type: "number" },
            },
        },
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: "Cache entry not found" }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: "Internal server error" }),
    __param(0, (0, common_1.Param)("name")),
    __param(1, (0, common_1.Param)("hash")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PageCacheController.prototype, "getPageCache", null);
__decorate([
    (0, common_1.Post)(":name/:hash"),
    (0, swagger_1.ApiOperation)({
        operationId: "SetPageCache",
        summary: "Store page HTML in cache",
        description: "Stores compressed HTML for a page identified by name and hash",
    }),
    (0, swagger_1.ApiParam)({
        name: "name",
        description: "Page cache name (e.g. value-creation_volume-pages)",
        example: "value-creation_volume-pages",
    }),
    (0, swagger_1.ApiParam)({
        name: "hash",
        description: "Opaque hash representing page state",
        example: "abc123def456",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: "Page cached successfully",
        schema: {
            type: "object",
            properties: {
                cached: { type: "boolean" },
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: "Invalid request body" }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: "Internal server error" }),
    __param(0, (0, common_1.Param)("name")),
    __param(1, (0, common_1.Param)("hash")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, set_page_cache_dto_1.SetPageCacheDto]),
    __metadata("design:returntype", Promise)
], PageCacheController.prototype, "setPageCache", null);
exports.PageCacheController = PageCacheController = __decorate([
    (0, swagger_1.ApiTags)("page-cache"),
    (0, common_1.Controller)("page-cache"),
    (0, common_1.UseInterceptors)(header_context_interceptor_1.HeaderContextInterceptor),
    __metadata("design:paramtypes", [get_page_cache_usecase_1.GetPageCacheUseCase,
        set_page_cache_usecase_1.SetPageCacheUseCase])
], PageCacheController);
//# sourceMappingURL=page-cache.controller.js.map