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
var SetPageCacheUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetPageCacheUseCase = void 0;
const common_1 = require("@nestjs/common");
const environment_config_service_1 = require("../../common/config/environment-config.service");
let SetPageCacheUseCase = SetPageCacheUseCase_1 = class SetPageCacheUseCase {
    constructor(pageCacheRepository, pageCacheConfigRepository, environmentConfig) {
        this.pageCacheRepository = pageCacheRepository;
        this.pageCacheConfigRepository = pageCacheConfigRepository;
        this.environmentConfig = environmentConfig;
        this.logger = new common_1.Logger(SetPageCacheUseCase_1.name);
    }
    async execute(name, hash, html) {
        if (!this.environmentConfig.pageCache.enabled) {
            this.logger.log("Page cache is disabled");
            return false;
        }
        const config = await this.pageCacheConfigRepository.getByName(name);
        if (!config || !config.cache.enabled) {
            this.logger.warn(`Page cache config not found or disabled for: ${name}`);
            return false;
        }
        const staleWindowSeconds = config.cache.staleWindowSeconds;
        const { maxSize, tags } = config.cache;
        if (Buffer.byteLength(html, "utf-8") > maxSize) {
            this.logger.warn(`HTML payload for "${name}" exceeds max size (${maxSize} bytes), discarding`);
            return false;
        }
        const saved = await this.pageCacheRepository.set(name, hash, html, staleWindowSeconds, tags);
        if (saved) {
            await this.pageCacheRepository.releaseRevalidationLock(name, hash);
            this.logger.log(`Cached page "${name}" with hash "${hash}"`);
        }
        return saved;
    }
};
exports.SetPageCacheUseCase = SetPageCacheUseCase;
exports.SetPageCacheUseCase = SetPageCacheUseCase = SetPageCacheUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("IPageCacheRepository")),
    __param(1, (0, common_1.Inject)("IPageCacheConfigRepository")),
    __param(2, (0, common_1.Inject)("IEnvironmentConfigService")),
    __metadata("design:paramtypes", [Object, Object, environment_config_service_1.EnvironmentConfigService])
], SetPageCacheUseCase);
//# sourceMappingURL=set-page-cache.usecase.js.map