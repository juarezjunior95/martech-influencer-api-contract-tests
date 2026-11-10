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
exports.ImagesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const images_service_1 = require("./images.service");
const images_brand_query_dto_1 = require("./dto/images-brand-query.dto");
const images_country_query_dto_1 = require("./dto/images-country-query.dto");
let ImagesController = class ImagesController {
    constructor(imagesService) {
        this.imagesService = imagesService;
    }
    getBrand(query) {
        return this.imagesService.resolveBrand(query.name, query.format ?? "square", query.brand_family);
    }
    getCountry(query) {
        return this.imagesService.resolveCountry(query.name, query.format ?? "icon");
    }
};
exports.ImagesController = ImagesController;
__decorate([
    (0, common_1.Get)("brand"),
    (0, swagger_1.ApiOperation)({
        operationId: "ResolveBrandImage",
        summary: "Resolve CDN URL for a brand image (single)",
    }),
    (0, swagger_1.ApiQuery)({ name: "name", required: false }),
    (0, swagger_1.ApiQuery)({ name: "format", required: false, enum: ["table", "square"] }),
    (0, swagger_1.ApiQuery)({ name: "brand_family", required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "{ url, matched, image_variants }" }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [images_brand_query_dto_1.ImagesBrandQueryDto]),
    __metadata("design:returntype", void 0)
], ImagesController.prototype, "getBrand", null);
__decorate([
    (0, common_1.Get)("country"),
    (0, swagger_1.ApiOperation)({
        operationId: "ResolveCountryImage",
        summary: "Resolve CDN URL for a country flag (single)",
    }),
    (0, swagger_1.ApiQuery)({ name: "name", required: false }),
    (0, swagger_1.ApiQuery)({ name: "format", required: false, enum: ["icon", "waving"] }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "{ url, matched }" }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [images_country_query_dto_1.ImagesCountryQueryDto]),
    __metadata("design:returntype", void 0)
], ImagesController.prototype, "getCountry", null);
exports.ImagesController = ImagesController = __decorate([
    (0, swagger_1.ApiTags)("images"),
    (0, common_1.Controller)("images"),
    __metadata("design:paramtypes", [images_service_1.ImagesService])
], ImagesController);
//# sourceMappingURL=images.controller.js.map