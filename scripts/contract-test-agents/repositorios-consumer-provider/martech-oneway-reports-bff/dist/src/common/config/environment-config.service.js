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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let EnvironmentConfigService = class EnvironmentConfigService {
    constructor(configService) {
        this.configService = configService;
    }
    get dataService() {
        return {
            baseUrl: this.configService.get("DATA_SERVICE_BASE_URL"),
        };
    }
    get redis() {
        return {
            host: this.configService.get("REDIS_HOST"),
            port: this.configService.get("REDIS_PORT"),
            password: this.configService.get("REDIS_PASSWORD"),
        };
    }
    get viewCache() {
        return {
            enabled: this.configService.get("VIEW_CACHE_ENABLED", "false") ===
                "true",
        };
    }
    get presetCache() {
        return {
            enabled: this.configService.get("PRESET_CACHE_ENABLED", "false") ===
                "true",
        };
    }
    get pageCache() {
        return {
            enabled: this.configService.get("PAGE_CACHE_ENABLED", "false") ===
                "true",
        };
    }
    get env() {
        return this.configService.get("NODE_ENV");
    }
};
exports.EnvironmentConfigService = EnvironmentConfigService;
exports.EnvironmentConfigService = EnvironmentConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EnvironmentConfigService);
//# sourceMappingURL=environment-config.service.js.map