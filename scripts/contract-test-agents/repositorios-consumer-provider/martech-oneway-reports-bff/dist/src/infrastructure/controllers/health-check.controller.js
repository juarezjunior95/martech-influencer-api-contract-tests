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
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const terminus_1 = require("@nestjs/terminus");
const environment_config_service_1 = require("../../common/config/environment-config.service");
let HealthController = class HealthController {
    constructor(health, http, environmentConfigService) {
        this.health = health;
        this.http = http;
        this.environmentConfigService = environmentConfigService;
    }
    checkLiveness() {
        return this.health.check([]);
    }
    checkReadiness() {
        const dataServiceUrl = this.environmentConfigService.dataService.baseUrl;
        return this.health.check([
            () => this.http.pingCheck("data-service", `${dataServiceUrl}/actuator/health/liveness`),
        ]);
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)("/liveness"),
    (0, terminus_1.HealthCheck)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "checkLiveness", null);
__decorate([
    (0, common_1.Get)("/readiness"),
    (0, terminus_1.HealthCheck)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "checkReadiness", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)("actuator/health"),
    __param(2, (0, common_1.Inject)("IEnvironmentConfigService")),
    __metadata("design:paramtypes", [terminus_1.HealthCheckService,
        terminus_1.HttpHealthIndicator,
        environment_config_service_1.EnvironmentConfigService])
], HealthController);
//# sourceMappingURL=health-check.controller.js.map