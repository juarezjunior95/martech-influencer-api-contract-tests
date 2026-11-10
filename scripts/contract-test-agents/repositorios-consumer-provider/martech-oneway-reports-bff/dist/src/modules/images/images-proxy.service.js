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
var ImagesProxyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagesProxyService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const rxjs_1 = require("rxjs");
const data_service_client_1 = require("../../infrastructure/services/data-service.client");
let ImagesProxyService = ImagesProxyService_1 = class ImagesProxyService {
    constructor(dataServiceClient) {
        this.dataServiceClient = dataServiceClient;
        this.logger = new common_1.Logger(ImagesProxyService_1.name);
    }
    async proxyBrand(query) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.dataServiceClient.get("/images/brand", {
                name: query.name,
                format: query.format,
                brand_family: query.brand_family,
            }));
            return response.data;
        }
        catch (error) {
            this.rethrowUpstream(error, "brand");
        }
    }
    async proxyCountry(query) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.dataServiceClient.get("/images/country", {
                name: query.name,
                format: query.format,
            }));
            return response.data;
        }
        catch (error) {
            this.rethrowUpstream(error, "country");
        }
    }
    rethrowUpstream(error, resource) {
        if ((0, axios_1.isAxiosError)(error) && error.response) {
            const { status, data } = error.response;
            throw new common_1.HttpException(typeof data === "object" && data !== null
                ? data
                : { message: String(data) }, status);
        }
        this.logger.error(`Images proxy (${resource}) failed: ${error instanceof Error ? error.message : String(error)}`);
        throw new common_1.HttpException("Data service unavailable", common_1.HttpStatus.BAD_GATEWAY);
    }
};
exports.ImagesProxyService = ImagesProxyService;
exports.ImagesProxyService = ImagesProxyService = ImagesProxyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [data_service_client_1.DataServiceClient])
], ImagesProxyService);
//# sourceMappingURL=images-proxy.service.js.map