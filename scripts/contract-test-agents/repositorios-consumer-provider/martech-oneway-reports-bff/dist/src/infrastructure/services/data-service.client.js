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
var DataServiceClient_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataServiceClient = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const environment_config_service_1 = require("../../common/config/environment-config.service");
let DataServiceClient = DataServiceClient_1 = class DataServiceClient {
    constructor(httpService, environmentConfigService, headerContextService) {
        this.httpService = httpService;
        this.environmentConfigService = environmentConfigService;
        this.headerContextService = headerContextService;
        this.logger = new common_1.Logger(DataServiceClient_1.name);
        this.baseUrl = this.environmentConfigService.dataService?.baseUrl || "";
        if (!this.baseUrl) {
            throw new Error("DATA_SERVICE_BASE_URL environment variable is required");
        }
    }
    getHeaders() {
        const baseHeaders = {
            "Content-Type": "application/json",
            Accept: "application/json",
        };
        return this.headerContextService.getPropagatedHeaders(baseHeaders);
    }
    get(endpoint, params) {
        const url = `${this.baseUrl}${endpoint}`;
        return this.httpService.get(url, {
            headers: this.getHeaders(),
            params,
        });
    }
};
exports.DataServiceClient = DataServiceClient;
exports.DataServiceClient = DataServiceClient = DataServiceClient_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)("IEnvironmentConfigService")),
    __param(2, (0, common_1.Inject)("IHeaderContextService")),
    __metadata("design:paramtypes", [axios_1.HttpService,
        environment_config_service_1.EnvironmentConfigService, Object])
], DataServiceClient);
//# sourceMappingURL=data-service.client.js.map